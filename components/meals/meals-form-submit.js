"use client";

import { useFormStatus } from "react-dom";

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();
  return (
    <p>
      <button disabled={pending} type="submit">
        {pending ? "Submitting..." : "Share Meal"}
      </button>
    </p>
  );
}
