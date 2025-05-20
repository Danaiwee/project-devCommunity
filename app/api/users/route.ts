import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handler/error";
import { NotFoundError, ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

// get all users
export async function GET() {
  try {
    const users = await User.find();

    if (!users) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// create user
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    const validateData = UserSchema.safeParse(body);
    if (!validateData.success)
      throw new ValidationError(validateData.error.flatten().fieldErrors);

    const { email, username } = validateData.data;

    const isExistingEmail = await User.findOne({ email });
    if (isExistingEmail) throw new Error("Email is already exists.");

    const isExistingUsername = await User.findOne({ username });
    if (isExistingUsername) throw new Error("Username is already exists.");

    const newUser = await User.create(validateData.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
