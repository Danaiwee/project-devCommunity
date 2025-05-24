"use server";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Question, Vote } from "@/database";
import Answer, { IAnswerDoc } from "@/database/answer.model";

import action from "../handler/action";
import handleError from "../handler/error";
import { NotFoundError } from "../http-error";
import {
  createAnswerSchema,
  DeleteAnswerSchema,
  GetAnswersSchema,
} from "../validations";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: createAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, content } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new NotFoundError("Question");

    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session }
    );

    question.answers += 1;

    await question.save({ session });

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function GetAnswers(
  params: GetAnswersParams
): Promise<
  ActionResponse<{ answers: Answer[]; isNext: boolean; totalAnswers: number }>
> {
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    questionId,
    page = 1,
    pageSize = 5,
    filter,
  } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    if (!answers) throw new NotFoundError("Answers");

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        totalAnswers,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function DeleteAnswer(
  params: DeleteAnswerParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const answer = await Answer.findById(answerId).session(session);

    if (!answer) throw new NotFoundError("Answer");

    if (answer.author.toString() !== userId)
      throw new Error("Unauthorized user.");

    await Question.updateOne(
      { _id: answer.question },
      { $inc: { answers: -1 } },
      { session }
    );

    await Vote.deleteMany({
      actionId: answerId,
      actionType: "answer",
    }).session(session);

    await Answer.findByIdAndDelete(answerId).session(session);

    await session.commitTransaction();

    revalidatePath(`/profile/${userId}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
