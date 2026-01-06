import React from "react";
import { FieldError } from "react-hook-form";

type Props = {
  error?: FieldError;
};

export const Error = ({ error }: Props) => {
  if (!error) {
    return null;
  }

  return <p className="text-red-500 text-sm">{error.message}</p>;
};
