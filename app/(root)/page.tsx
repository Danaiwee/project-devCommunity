import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/filters/HomeFilters";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { getQuestions } from "@/lib/actions/question.action";

interface SeachParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SeachParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, errors } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { questions } = data || {};

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

      {success ? (
        <section className="mt-10 flex w-full flex-col gap-6">
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))
          ) : (
            <p className="text-dark400_light700">No questions found</p>
          )}
        </section>
      ) : (
        <section className="mt-10 flex w-full items-center jsutify-center">
          <p className="text-dark400_light700">
            {errors?.message || "Failed to fetch questions"}
          </p>
        </section>
      )}
    </>
  );
};

export default Home;
