"use client";

import {ReactNode} from "react";
import {observer} from "mobx-react-lite";
import {useGlobalsContext} from "@/providers/global/config";
import Link from "next/link";
import {Logout} from "@/session/logout/ui";

type Props = {
  children: ReactNode;
}

export const AppLayout = observer(({children}: Props) => {
  const {context} = useGlobalsContext()

  return (
    <div className="container mx-auto">
      <header className="py-3 flex justify-between items-center border-b-black border-b mb-3">
        <h6>
          <Link href="/">Next + Mobx</Link>
        </h6>
        {
          context.session.user ? (
            <div className="flex items-center">
              <strong className="inline-block">Hello {context.session.user.name}!</strong>
              <span className="ml-3 inline-block">
                <Logout />
              </span>
            </div>
          ) : (
            <Link href="/auth/login" className="inline-block bg-blue-500 text-white p-2 rounded-lg">
              Login
            </Link>
          )
        }
      </header>
      {children}
    </div>
  )
})

AppLayout.displayName = "AppLayout";