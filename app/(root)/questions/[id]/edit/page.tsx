import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";

export const metadata: Metadata = {
  title: "Dev Community | Edit question",
  description:
    "Update and improve your technical questions on Dev Community. Make edits to clarify your post and get better answers from fellow developers.",
};

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();

  if (question?.author._id.toString() !== session.user?.id)
    return redirect(ROUTES.QUESTION(id));

  return (
    <main>
      <h1 className="h1-bold text-dark100_light900 mb-9">Edit a Question</h1>

      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestion;
