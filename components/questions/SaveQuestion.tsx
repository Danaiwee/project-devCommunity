"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { use, useState } from "react";
import { toast } from "sonner";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";

interface Props {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

const SaveQuestion = ({ questionId, hasSavedQuestionPromise }: Props) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(hasSavedQuestionPromise);
  const { saved: hasSaved } = data || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;

    if (!userId) {
      return toast("Failed to save the question", {
        description: "You need to log in before save the question",
      });
    }

    setIsLoading(true);
    try {
      const { success, data, errors } = await toggleSaveQuestion({
        questionId,
      });

      if (!success) throw new Error(errors?.message || "An error occurred.");

      toast(`Question ${data?.saved ? "saved" : "unsaved"} successfully`);
    } catch (error) {
      return toast("Error", {
        description:
          error instanceof Error ? error.message : "An error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
