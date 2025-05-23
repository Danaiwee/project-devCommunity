import Image from "next/image";

import { formatNumber } from "@/lib/utils";

interface Props {
  totalQuestions: number;
  totalAnswers: number;
  badges: Badges;
}

interface StatsCardProps {
  imageUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imageUrl, value, title }: StatsCardProps) => (
  <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
    <Image src={imageUrl} alt={title} width={40} height={50} />

    <div>
      <p className="paragraph-semibold text-dark200_light900">{value}</p>
      <p className="body-medium tex-dark300_light700">{title}</p>
    </div>
  </div>
);

const Stats = ({ totalQuestions, totalAnswers, badges }: Props) => {
  return (
    <div className="mt-3">
      <h4 className="h2-semibold text-dark200_light900">Stats</h4>

      <div className="mt-5 grid grd-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>

          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <StatsCard
          imageUrl="/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold badges"
        />
        <StatsCard
          imageUrl="/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver badges"
        />
        <StatsCard
          imageUrl="/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze badges"
        />
      </div>
    </div>
  );
};

export default Stats;
