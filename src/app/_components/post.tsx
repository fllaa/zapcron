"use client";

import { useState } from "react";
import { Input } from "@nextui-org/react";
import { Send } from "lucide-react";

import { api } from "@bolabali/trpc/react";
import { IconButton } from "@bolabali/app/_components/common";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <Input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <IconButton
          icon={<Send size={16} color="black" />}
          type="submit"
          color="primary"
          variant="ghostv2"
          size="lg"
          isLoading={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </IconButton>
      </form>
    </div>
  );
}
