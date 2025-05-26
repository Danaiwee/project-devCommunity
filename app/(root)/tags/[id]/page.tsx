import { Metadata } from "next";
import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilters from "@/components/filters/CommonFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getTagQuestions } from "@/lib/actions/tag.action";

export async function generateMetadata({
  params,
  searchParams,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { success, data } = await getTagQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    tagId: id,
  });

  if (!success || !data) {
    return {
      title: "Dev Community | Tag",
      description: "Browse all developer questions tagged",
    };
  }

  const { tag } = data!;
  const formatTagName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const tagName = formatTagName(tag.name);

  return {
    title: `Dev Community | ${tagName}`,
    description: `Browse all developer questions tagged with "${tagName}" on Dev Community. Find solutions, ask questions, and join discussions around ${tagName}.`,
  };
}

const TagQuestion = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { success, data, errors } = await getTagQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    tagId: id,
  });

  const { tag, questions, isNext } = data || {};
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900 capitalize">
          {tag?.name}
        </h1>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imageSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <CommonFilters
          filters={TagFilters}
          otherClasses="min-h-[56px] max-md:w-full sm:min-w-[170px]"
        />
      </section>

      <DataRenderer
        success={success}
        errors={errors}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default TagQuestion;
