import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilters from "@/components/filters/CommonFilters";
import HomeFilters from "@/components/filters/HomeFilters";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
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

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          placeholder="Search Questions..."
          imageSrc="/icons/search.svg"
          otherClasses="flex-1"
        />

        <CommonFilters
          filters={HomePageFilters}
          otherClasses="min-h-[40px] sm:min-w-[170px] w-full"
          containerClasses="hidden max-md:flex"
        />
      </section>

      <section className="mt-5">
        <HomeFilters />
      </section>

      <DataRenderer
        success={success}
        errors={errors}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <section className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </section>
        )}
      />
    </>
  );
};

export default Home;
