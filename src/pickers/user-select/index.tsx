"use client";

import { observer } from "mobx-react-lite";
import React, { ReactNode, SelectHTMLAttributes } from "react";

import { UsersSelectVM } from "@/pickers/user-select/view-model";
import { useGlobalsContext } from "@/providers/global/config";

type Props = {
  placeholder?: ReactNode;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const UsersSelect = observer(
  ({ placeholder = "Select user", ...props }: Props) => {
    const { vm } = useGlobalsContext(UsersSelectVM);

    const loader = vm.loadUsers.state.loading ? "Loading..." : placeholder;

    return (
      <label>
        {placeholder}:{" "}
        <select {...props}>
          <option value="" disabled>
            {loader}
          </option>
          {vm.users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>
    );
  },
);
