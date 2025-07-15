"use client";

import { Card, CardBody, type CardProps } from "@heroui/react";
import type React from "react";

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
