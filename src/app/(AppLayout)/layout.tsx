import { ReactNode } from "react";

import { AppLayout } from "@/widgets/app-layout";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return <AppLayout>{children}</AppLayout>;
}
