import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";

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
