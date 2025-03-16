/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useMemo, useState } from "react";
import { type Session } from "next-auth";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { PenLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { api } from "@zapcron/trpc/react";
import { Role } from "@zapcron/constants/role";
import { zUpdateMeInput } from "@zapcron/zod/user";
import { fileToDataUrl } from "@zapcron/utils/file";

interface UserProfileDrawerProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  user: Session["user"];
}

const UserProfileDrawer = ({ buttonRef, user }: UserProfileDrawerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const image = useMemo(() => {
    if (!file) {
      return user?.image;
    }

    return URL.createObjectURL(file);
  }, [file, user?.image]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const roles = Object.values(Role);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(zUpdateMeInput),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image,
    },
  });

  const updateMe = api.user.updateMe.useMutation({
    onSuccess: async () => {
      // reload window with delayed 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      window.location.reload();
    },
  });

  return (
    <>
      <button ref={buttonRef} className="hidden" onClick={onOpen}>
        open
      </button>
      <Drawer
        placement="left"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <form
              onSubmit={handleSubmit(async (data) => {
                const params: Record<
                  "name" | "email" | "image",
                  string | undefined
                > = {
                  name: data.name ?? undefined,
                  email: data.email ?? undefined,
                  image: undefined,
                };
                if (file) {
                  data.image = await fileToDataUrl(file);
                }
                toast.promise(updateMe.mutateAsync(params), {
                  loading: "Saving...",
                  success: "Profile updated successfully",
                  error: "Failed to update profile",
                });
                onClose();
              })}
            >
              <DrawerHeader className="flex flex-col gap-1">
                Your Profile
              </DrawerHeader>
              <DrawerBody>
                <label
                  htmlFor="image"
                  className="group relative w-fit cursor-pointer"
                >
                  <Avatar
                    isBordered
                    className="h-24 w-24 text-large group-hover:brightness-75"
                    src={image ?? ""}
                  />
                  <span className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 transform text-white opacity-0 group-hover:opacity-100">
                    <PenLine size={24} />
                  </span>
                </label>
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFile(file);
                    }
                  }}
                />
                <div className="my-2 space-y-2">
                  <Input
                    {...register("name")}
                    label="Name"
                    placeholder="John Doe"
                    variant="bordered"
                    isInvalid={!!errors.name?.message}
                    errorMessage={errors.name?.message}
                  />
                  <Input
                    {...register("email")}
                    label="Email"
                    placeholder="johndoe@mail.com"
                    variant="bordered"
                    isInvalid={!!errors.email?.message}
                    errorMessage={errors.email?.message}
                  />
                  <Select
                    label="Role"
                    placeholder="Select a role"
                    variant="bordered"
                    defaultSelectedKeys={[user?.role]}
                    isDisabled
                  >
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </DrawerFooter>
            </form>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { UserProfileDrawer };
