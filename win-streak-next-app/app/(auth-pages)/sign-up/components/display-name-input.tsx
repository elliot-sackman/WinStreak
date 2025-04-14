"use client";

import React, { useState, useEffect } from "react";

export default function DisplayNameInput({
  existingUsernames,
  onValidChange,
}: {
  existingUsernames: string[];
  onValidChange: (isValid: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validateDisplayName = (displayName: string) => {
    if (displayName.length < 8) {
      setError("Display name must be at least 8 characters.");
      onValidChange(false);
      return false;
    }

    if (existingUsernames.includes(displayName)) {
      setError("Display name is already taken.");
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
    validateDisplayName(input);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        name="display name"
        value={value}
        onChange={handleChange}
        placeholder="Enter your display name"
        className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring mb-4"
        required
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
