"use client";

import React, { useState } from "react";

export default function EmailInput({
  onValidChange,
}: {
  onValidChange: (isValid: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|io|co|us|uk)$/i;
    if (!emailRegex.test(email.toLowerCase())) {
      setError("Invalid email format. Please use a valid email address.");
      onValidChange(false);
      return false;
    }

    setError("");
    onValidChange(true);
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);
    validateEmail(input);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        name="email"
        value={value}
        onChange={handleChange}
        placeholder="Enter your email"
        className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring mb-4"
        required
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
