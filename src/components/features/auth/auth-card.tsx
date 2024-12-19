"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Divider,
} from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { Eye, EyeClosed } from "lucide-react";
import { FaGithub, FaMicrosoft } from "react-icons/fa6";

const AuthCard = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <div className="w-full text-center">
          <h2 className="text-lg font-semibold">Sign In to Your Account</h2>
          <p className="text-sm text-gray-500">
            Enter your email and password to sign in
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <Input
            autoFocus
            isClearable
            label="Email"
            placeholder="Enter your email"
            variant="bordered"
          />
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            variant="bordered"
            endContent={
              <button
                aria-label="toggle password visibility"
                className="text-gray-500 focus:outline-none"
                type="button"
                onClick={togglePassword}
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        </div>
      </CardBody>
      <CardFooter>
        <div className="w-full space-y-4 text-center">
          <Button type="submit" color="primary">
            Sign In
          </Button>
          <div className="flex items-center justify-center gap-2">
            <Divider />
            <span className="text-sm text-gray-500">OR</span>
            <Divider />
          </div>
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
      </CardFooter>
    </Card>
  );
};

export { AuthCard };
