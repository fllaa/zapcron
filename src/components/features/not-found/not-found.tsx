"use client";

import { Button, Card, CardBody, Link } from "@heroui/react";
import { LogoLink } from "@zapcron/components/common";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card>
        <CardBody>
          <div className="flex flex-col items-center space-y-4 p-4">
            <LogoLink />
            <h1 className="font-bold text-4xl">404</h1>
            <p className="text-center text-lg">
              The page you are looking for does not exist.
            </p>
            <Button
              as={Link}
              href="/"
              startContent={<Home size={16} />}
              variant="faded"
            >
              Go back to home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export { NotFound };
