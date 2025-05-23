import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handler/error";
import { NotFoundError, ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";

import { UserSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const { email } = await request.json();

  const validatedData = UserSchema.partial().safeParse({ email });

  if (!validatedData.success)
    throw new ValidationError(validatedData.error.flatten().fieldErrors);
  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
