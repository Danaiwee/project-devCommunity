"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useState } from "react";
import { toast } from "sonner";

import { createVoteCount } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";

interface Props {
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
  targetId: string;
  targetType: "question" | "answer";
}

const Votes = ({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetId,
  targetType,
}: Props) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { success, data } = use(hasVotedPromise);
  const { hasupVoted, hasdownVoted } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast("Please login to vote.", {
        description: "Only log in user can vote.",
      });
    }

    setIsLoading(true);

    try {
      const result = await createVoteCount({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        return toast(`Error ${result.status}`, {
          description: result.errors?.message,
        });
      }

      const successMessage =
        voteType === "upvote"
          ? `Upvoted ${!hasupVoted ? "added" : "removed"} successfully`
          : `Downvoted ${!hasdownVoted ? "added" : "removed"} successfully`;

      toast(`${successMessage}`, {
        description: "Your vote has been recorded.",
      });
    } catch {
      toast("Failed to vote.", {
        description: "An error occurred while voting. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={success && hasupVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          width={18}
          height={19}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"} `}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={success && hasdownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
