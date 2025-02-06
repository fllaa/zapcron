"use client";

import React from "react";
import { Card, CardBody, type CardProps } from "@heroui/react";

interface CardPageProps extends CardProps {
  children?: React.ReactNode;
}

const CardPage = ({ children, ...props }: CardPageProps) => {
  return (
    <Card {...props}>
      <CardBody>{children}</CardBody>
    </Card>
  );
};

export { CardPage };
