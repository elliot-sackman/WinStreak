"use client";

import React, { useState } from "react";

export default function PasswordInput({
  onValidChange,
}: {
  onValidChange: (isValid: boolean) => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const validatePassword = (value: string) => {
    const requirements = [
      { regex: /[A-Z]/, message: "at least one uppercase letter" },
      { regex: /[a-z]/, message: "at least one lowercase letter" },
      { regex: /[0-9]/, message: "at least one number" },
      { regex: /[@$!%*?&]/, message: "at least one special character" },
      { regex: /.{8,}/, message: "at least 8 characters long" },
    ];

    const unmetRequirements = requirements.filter(
      (req) => !req.regex.test(value)
    );

    if (unmetRequirements.length > 0) {
      setError(
        `Password must have ${unmetRequirements
          .map((req) => req.message)
          .join(", ")}.`
      );
      onValidChange(false);
    } else {
      setError("");
      validateConfirmPassword(confirmPassword, value); // Revalidate confirm password
    }
  };

  const validateConfirmPassword = (
    confirmValue: string,
    originalValue: string
  ) => {
    if (confirmValue !== originalValue) {
      setConfirmError("Passwords do not match.");
      onValidChange(false);
    } else {
      setConfirmError("");
      onValidChange(true);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(value, password);
  };

  return (
    <div className="w-full">
      <input
        type="password"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter your password"
        className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring mb-4"
        required
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="Confirm your password"
        className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring mb-4"
        required
      />
      {confirmError && (
        <p className="text-red-500 text-sm mt-1">{confirmError}</p>
      )}
    </div>
  );
}
