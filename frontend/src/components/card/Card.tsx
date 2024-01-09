import React, { FC, ReactNode } from "react";

interface CardProps {
  style: string;
  children: ReactNode;
}

const Card: FC<CardProps> = (props: CardProps) => {
  return <div className={`card ${props.style}`}>{props.children}</div>;
};

export default Card;
