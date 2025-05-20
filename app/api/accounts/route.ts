import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handler/error";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";

import { AccountSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();
    if (!accounts) throw new NotFoundError("Accounts");

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  const validatedData = AccountSchema.safeParse(body);
  if (!validatedData.success)
    throw new ValidationError(validatedData.error.flatten().fieldErrors);

  try {
    await dbConnect();

    const isExistingAccount = await Account.findOne({
      provider: validatedData.data.provider,
      providerAccount: validatedData.data.providerAccountId,
    });

    if (isExistingAccount)
      throw new ForbiddenError("Account is already exists");

    const newAccount = await Account.create(validatedData.data);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
