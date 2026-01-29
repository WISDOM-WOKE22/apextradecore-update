"use client";

import { motion } from "motion/react";

type Variant = "primary" | "accent";

interface BaseProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}

interface ButtonAsButton extends BaseProps {
  as?: "button";
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

interface ButtonAsLink extends BaseProps {
  as: "a";
  href: string;
  onClick?: () => void;
  type?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants = {
  primary:
    "bg-[#212121] text-white hover:bg-[#383838] focus-visible:ring-2 focus-visible:ring-[#212121] focus-visible:ring-offset-2",
  accent:
    "bg-[#1e62d4] text-white hover:bg-[#1552b8] focus-visible:ring-2 focus-visible:ring-[#1e62d4] focus-visible:ring-offset-2",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-base font-medium transition-colors duration-200";
  const combined = `${base} ${variants[variant]} ${className}`.trim();

  const motionProps = {
    className: combined,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  };

  if (props.as === "a" && "href" in props) {
    return (
      <motion.a href={props.href} onClick={props.onClick} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      {...motionProps}
      whileHover={props.disabled ? {} : { scale: 1.02 }}
      whileTap={props.disabled ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
