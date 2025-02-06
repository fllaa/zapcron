"use client";

import React from "react";
import { Button, Card, CardHeader, CardBody } from "@heroui/react";
import { signIn } from "next-auth/react";
import { FaGithub, FaMicrosoft } from "react-icons/fa6";

const AuthCard = () => {
  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <div className="w-full text-center">
          <h2 className="text-lg font-semibold">Sign In to Your Account</h2>
          <p className="text-sm text-gray-500">
            Sign in to access your account
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="w-full space-y-4 text-center">
          <Button
            color="default"
            variant="bordered"
            startContent={<FaGithub size={16} />}
            onPress={() => signIn("github")}
          >
            Sign In with Github
          </Button>
          <Button
            color="default"
            variant="bordered"
            startContent={<FaMicrosoft size={16} />}
            onPress={() => signIn("microsoft-entra-id")}
          >
            Sign In with Microsoft
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export { AuthCard };
