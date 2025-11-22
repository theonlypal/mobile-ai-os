"use client";
import { InputHTMLAttributes, forwardRef } from "react";

const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput(
  { className = "", ...props },
  ref
) {
  return <input ref={ref} className={`w-full ${className}`} {...props} />;
});

export default TextInput;
