import React, {ReactNode} from 'react';

type Props = {
  children: ReactNode;
}

export const CenterLayout = ({children}: Props) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="container">
        {children}
      </div>
    </div>
  );
};
