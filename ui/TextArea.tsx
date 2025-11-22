"use client";
import { TextareaHTMLAttributes, forwardRef } from "react";

const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea(
  { className = "", ...props },
  ref
) {
  return <textarea ref={ref} className={`w-full min-h-[120px] ${className}`} {...props} />;
});

export default TextArea;
