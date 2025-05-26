import { Metadata } from "next";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilters from "@/components/filters/CommonFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { CollectionFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";

export const metadata: Metadata = {
  title: "Dev Community | Saved questions collection",
  description:
    "View your collection of saved and bookmarked questions on Dev Community. Quickly access your favorite topics and keep track of interesting developer discussions.",
};

const Collection = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, errors } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { collections, isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          imageSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />

        <CommonFilters
          filters={CollectionFilters}
          otherClasses="min-h-[56px] max-md:w-full sm:min-w-[170px]"
        />
      </div>

      <DataRenderer
        success={success}
        errors={errors}
        data={collections}
        empty={EMPTY_QUESTION}
        render={(collections) => (
          <div className="mt-10 flex w-full flex-col gap6">
            {collections.map((collection) => (
              <QuestionCard
                key={collection._id}
                question={collection.question}
              />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Collection;
