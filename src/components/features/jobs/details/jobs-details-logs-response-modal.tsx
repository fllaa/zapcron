"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Braces } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface JobsDetailsLogsResponseModalProps {
  data: Record<string, unknown>;
}

const JobsDetailsLogsResponseModal = ({
  data,
}: JobsDetailsLogsResponseModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        startContent={<Braces size={12} />}
        size="sm"
        variant="faded"
      >
        Show
      </Button>
      <Modal
        size="4xl"
        scrollBehavior="inside"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Response
              </ModalHeader>
              <ModalBody>
                <SyntaxHighlighter language="json" style={dracula}>
                  {JSON.stringify(data ?? {}, null, 2)}
                </SyntaxHighlighter>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export { JobsDetailsLogsResponseModal };
