import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handler/error";
import { NotFoundError, ValidationError } from "@/lib/http-error";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  if (!providerAccountId) throw new NotFoundError("Provider ID");

  const validatedData = AccountSchema.partial().safeParse(providerAccountId);
  if (!validatedData.success)
    throw new ValidationError(validatedData.error.flatten().fieldErrors);

  try {
    await dbConnect();

    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
