import React, {ReactNode} from 'react';
import {CenterLayout} from "@/widgets/center-layout";

type Props = {
  children: ReactNode;
}

const Layout = ({children}: Props) => {
  return (
    <CenterLayout>
      {children}
    </CenterLayout>
  );
};

export default Layout;