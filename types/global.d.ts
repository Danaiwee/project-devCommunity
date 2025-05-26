import { NextResponse } from "next/server";

declare global {
  interface Tag {
    _id: string;
    name: string;
    questions: number;
  }

  interface Author {
    _id: string;
    name: string;
    image: string;
  }

  interface Question {
    _id: string;
    title: string;
    content: string;
    tags: Tag[];
    author: Author;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
    createdAt: Date;
  }

  type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    errors?: {
      message: string;
      details?: Record<string, string[]>;
    };
    status?: number;
  };

  type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
  type ErrorResponse = ActionResponse<undefined> & { success: false };

  type APIResponse = NextResponse<SuccessResponse<T> | ErrorResponse>;
  type APIErrorResponse = NextResponse<ErrorResponse>;

  type RouteParams = {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
  };

  interface PaginatedSearchParams {
    page?: number;
    pageSize?: number;
    query?: string;
    filter?: string;
    sort?: string;
  }

  interface Answer {
    _id: string;
    author: Author;
    content: string;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    question: string;
  }

  interface HasVotedResponse {
    hasupVoted: boolean;
    hasdownVoted: boolean;
  }

  interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
    createdAt: Date;
  }

  interface Collection {
    _id: string;
    author: string | Author;
    question: Question;
  }

  interface Badges {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
  }

  interface Country {
    name: {
      common: string;
      official: string;
      nativeName?: unknown;
    };
  }

  interface Job {
    job_id?: string;
    employer_name?: string;
    employer_logo?: string | undefined;
    employer_website?: string;
    job_employment_type?: string;
    job_title?: string;
    job_description?: string;
    job_apply_link?: string;
    job_city?: string;
    job_state?: string;
    job_country?: string;
  }

  interface GlobalSearchItem {
    id: string;
    type: "question" | "answer" | "user" | "tag";
    title: string;
  }
}
