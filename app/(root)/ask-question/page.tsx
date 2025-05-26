import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";

export const metadata: Metadata = {
  title: "Dev Community | Ask a question",
  description: "Ask technical questions and get answers from experienced developers on Dev Community. Whether it's React, Next.js, or any tech topic—get help fast from the dev community.",
};

const AskQuestion = async () => {
  const session = await auth();

  if (!session) return redirect("/sign-in");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>

      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  );
};

export default AskQuestion;
