"use client";

import React, { useState } from "react";

export default function BirthdayInput() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow only numbers and slashes
    const formattedInput = input.replace(/[^0-9/]/g, "");

    // Automatically add slashes as the user types
    if (formattedInput.length === 2 || formattedInput.length === 5) {
      if (!formattedInput.endsWith("/")) {
        setValue(formattedInput + "/");
      } else {
        setValue(formattedInput);
      }
    } else if (formattedInput.length <= 10) {
      setValue(formattedInput);
    }

    // Clear error when user is typing
    setError("");
  };

  const validateDate = () => {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

    if (!dateRegex.test(value)) {
      setError("Invalid date format. Please use MM/DD/YYYY.");
      return false;
    }

    const [month, day, year] = value.split("/").map(Number);
    const enteredDate = new Date(year, month - 1, day);
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    if (enteredDate > eighteenYearsAgo) {
      setError("You must be at least 18 years old.");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <div className="w-full">
      <input
        type="text"
        name="birthday"
        value={value}
        onChange={handleChange}
        onBlur={validateDate} // Validate on blur
        placeholder="MM/DD/YYYY"
        className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring mb-4"
        maxLength={10} // Limit input to 10 characters (MM/DD/YYYY)
        required
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
