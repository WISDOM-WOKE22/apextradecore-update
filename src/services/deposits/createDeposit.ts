"use client";

import { ref, push, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage, auth } from "@/lib/firebase";
import { DB, formatDbDate } from "@/lib/realtime-db";

export interface CreateDepositInput {
  userId: string;
  amount: string;
  paymentMethod: string;
  paymentProofURL?: string;
  proofFile?: File;
}

export type CreateDepositResult =
  | { success: true; transactionId: string }
  | { success: false; error: string };

const STORAGE_PATH = "depositProofs";

export async function createDeposit(input: CreateDepositInput): Promise<CreateDepositResult> {
  try {
    let proofUrl = input.paymentProofURL ?? "";

    if (input.proofFile) {
      const uid = auth.currentUser?.uid;
      if (!uid) return { success: false, error: "Not signed in" };
      const ext = input.proofFile.name.split(".").pop() || "bin";
      const fileRef = storageRef(
        storage,
        `${STORAGE_PATH}/${uid}/${Date.now()}.${ext}`
      );
      await uploadBytes(fileRef, input.proofFile);
      proofUrl = await getDownloadURL(fileRef);
    }

    const userDepositsRef = ref(database, DB.userDeposits(input.userId));
    const newRef = push(userDepositsRef);
    const transactionId = newRef.key;
    if (!transactionId) return { success: false, error: "Failed to create transaction" };

    const createdAt = Date.now();
    await set(newRef, {
      amount: input.amount,
      date: formatDbDate(new Date()),
      createdAt,
      paymentMethod: input.paymentMethod,
      paymentProofURL: proofUrl,
      status: "Pending",
      transactionId,
      type: "Trading",
    });

    return { success: true, transactionId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create deposit";
    return { success: false, error: message };
  }
}
