"use client";

import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmailInput from "./email-input";
import BirthdayInput from "./birthday-input";
import PasswordInput from "./password-input";
import DisplayNameInput from "./display-name-input";
import React, { useState } from "react";

export default function SignupForm({
  searchParams,
  existingUsernames,
}: {
  searchParams: Message;
  existingUsernames: string[];
}) {
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isBirthdayValid, setIsBirthdayValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);

  // Check if the entire form is valid
  const isFormValid =
    isPasswordValid &&
    isBirthdayValid &&
    isUsernameValid &&
    isEmailValid &&
    isFirstNameValid &&
    isLastNameValid;

  const validateNonNullString = (value: string) => {
    return value.trim().length > 0;
  };

  return (
    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
      <div className="flex flex-col gap-2 [&>input]:mb-3">
        <Label htmlFor="email">Email</Label>
        <EmailInput onValidChange={setIsEmailValid} />
        <Label htmlFor="display name">Display Name</Label>
        <DisplayNameInput
          existingUsernames={existingUsernames}
          onValidChange={setIsUsernameValid}
        />
        <Label htmlFor="first">First Name</Label>
        <Input
          type="name"
          name="first"
          placeholder="First"
          required
          onChange={(e) =>
            setIsFirstNameValid(validateNonNullString(e.target.value))
          }
        />
        <Label htmlFor="last">Last Name</Label>
        <Input
          type="name"
          name="last"
          placeholder="Last"
          required
          onChange={(e) =>
            setIsLastNameValid(validateNonNullString(e.target.value))
          }
        />
        <Label htmlFor="birthday">Birthday</Label>
        <BirthdayInput onValidChange={setIsBirthdayValid} />
        <Label htmlFor="password">Password</Label>
        <PasswordInput onValidChange={setIsPasswordValid} />

        <SubmitButton
          pendingText="Signing up..."
          disabled={!isFormValid} // Disable button if the form is invalid
          formAction={signUpAction}
        >
          Sign up
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
