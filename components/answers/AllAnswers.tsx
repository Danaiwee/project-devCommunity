import { AnswerFilters } from "@/constants/filters";
import { EMPTY_ANSWERS } from "@/constants/states";

import AnswerCard from "../cards/AnswerCard";
import DataRenderer from "../DataRenderer";
import CommonFilters from "../filters/CommonFilters";
import Pagination from "../Pagination";

interface Props extends ActionResponse<Answer[]> {
  totalAnswers: number;
  page: number | string | undefined;
  isNext: boolean;
}

const AllAnswers = ({
  success,
  data,
  errors,
  totalAnswers,
  page,
  isNext,
}: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommonFilters filters={AnswerFilters} otherClasses="sm:min-w-32" />
      </div>

      <DataRenderer
        success={success}
        errors={errors}
        empty={EMPTY_ANSWERS}
        data={data}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }
      />

      <Pagination page={page} isNext={isNext} />
    </div>
  );
};

export default AllAnswers;
