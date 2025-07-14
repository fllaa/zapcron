"use client";

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import _ from "lodash";
import { Braces } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface JobsDetailsLogsResponseModalProps {
  id: string;
  data: Record<string, unknown>;
}

const JobsDetailsLogsResponseModal = ({
  id,
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
                  {_.truncate(JSON.stringify(data ?? {}, null, 2), {
                    length: 1000,
                  })}
                </SyntaxHighlighter>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  showAnchorIcon
                  as={Link}
                  href={`/api/logs/${id}/raw`}
                  rel="noreferrer noopener"
                  target="_blank"
                  color="primary"
                  variant="flat"
                >
                  Open Raw Response
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
