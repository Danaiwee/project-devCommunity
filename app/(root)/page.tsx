import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/filters/HomeFilters";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import handleError from "@/lib/handler/error";
import { ValidationError } from "@/lib/http-error";

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    content: "I want to learn React, can anyone help me?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "JavaScript" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image:
        "https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2024-04-07"),
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    content: "I want to learn JavaScript, can anyone help me?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "JavaScript" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image:
        "https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-women-cartoon-avatar-in-flat-style-png-image_6110776.png",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2023-05-15"),
  },
];

interface SeachParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const test = () => {
  try {
    throw new ValidationError({
      title: ["Required"],
      email: ["Incorrect pattern"]
    })
  } catch (error) {
    return handleError(error);
  }
};

const Home = async ({ searchParams }: SeachParams) => {
  const result = await test();

  console.log(result);

  const { query = "" } = await searchParams;

  const filterQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(query?.toLowerCase())
  );

  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-11">
        <LocalSearch
          route="/"
          placeholder="Search Questions..."
          imageSrc="/icons/search.svg"
          otherClasses="flex-1"
        />
      </section>

      <section className="mt-5">
        <HomeFilters />
      </section>

      <section className="mt-10 flex w-full flex-col gap-6">
        {filterQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </section>
    </>
  );
};

export default Home;
