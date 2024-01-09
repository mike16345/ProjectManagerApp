import React, { FC, ReactNode } from "react";

interface BoxRowProps {
  children: ReactNode;
}

const BoxRow: FC<BoxRowProps> = (props: BoxRowProps) => {
  return <div className="container">{props.children}</div>;
};

export default BoxRow;
