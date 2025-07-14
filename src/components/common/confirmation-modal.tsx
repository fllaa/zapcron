"use client";

import {
  Button,
  type ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import type React from "react";
import { useState } from "react";

interface ConfirmationModalProps {
  renderTrigger: (onOpen: () => void) => React.ReactNode;
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
  color?: ButtonProps["color"];
}

const ConfirmationModal = ({
  renderTrigger,
  onConfirm,
  title = "Confirmation",
  message = "Are you sure?",
  color = "primary",
}: ConfirmationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {renderTrigger(onOpen)}
      <Modal
        size="sm"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: "rounded-b-none md:rounded-b-[--heroui-radius-large]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <p>{message}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color={color}
                  onPress={async () => {
                    setIsLoading(true);
                    await onConfirm();
                    setIsLoading(false);
                    onClose();
                  }}
                  isLoading={isLoading}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export { ConfirmationModal };
