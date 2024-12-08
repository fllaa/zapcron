"use client";

import React from "react";
import { Image, Link } from "@nextui-org/react";

const LogoLink = () => {
  return (
    <Link
      href="/"
      className="mb-2 flex items-center gap-2 py-4 text-default-foreground"
    >
      <Image src="/images/logo.png" alt="logo.png" width={40} height={40} />
      <span className="text-2xl font-bold">Bolabali</span>
    </Link>
  );
};

export { LogoLink };