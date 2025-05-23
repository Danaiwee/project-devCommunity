import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import { getTopQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";

import TagCard from "../cards/TagCard";
import DataRenderer from "../DataRenderer";

const RightSidebar = async () => {
  const [
    { success: topQuestionsSuccess,data: topQuestions,errors: topQuestionsError,},
    { success: topTagsSuccess, data: topTags, errors: topTagsError },
  ] = await Promise.all([getTopQuestions(), getTopTags()]);

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-1 p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <DataRenderer
          success={topQuestionsSuccess}
          data={topQuestions}
          errors={topQuestionsError}
          empty={EMPTY_QUESTION}
          render={(topQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {topQuestions.map(({ _id, title }) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700 line-clamp-2">
                    {title}
                  </p>
                  <Image
                    src="/icons/chevron-right.svg"
                    alt="chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <DataRenderer
          success={topTagsSuccess}
          errors={topTagsError}
          data={topTags}
          empty={EMPTY_TAGS}
          render={(topTags) => (
            <div className="mt-7 flex flex-col gap-4">
              {topTags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
