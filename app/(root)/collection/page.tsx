import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";


const Collection = async ({searchParams}: RouteParams) => {
  const {page, pageSize, query, filter} = await searchParams;

  const {success, data, errors} = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter
  });

  const {collections} = data || {};

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>
        Saved Questions
      </h1>

      <div className='mt-11 justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearch 
          route={ROUTES.COLLECTION}
          imageSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </div>

      <DataRenderer 
        success={success}
        errors={errors}
        data={collections}
        empty={EMPTY_QUESTION}
        render={(collections) => (
          <div className='mt-10 flex w-full flex-col gap6'>
            {collections.map((collection) => (
              <QuestionCard key={collection._id} question={collection.question} />
            ))}
          </div>
        )}
      />
    </>
  )
}

export default Collection