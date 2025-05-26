import Image from "next/image";
import Link from "next/link";

import { processJobTitle } from "@/lib/utils";

interface JobLocationProps {
  jobCity?: string;
  jobState?: string;
  jobCountry?: string;
}

const JobLocation = ({ jobCity, jobState, jobCountry }: JobLocationProps) => {
  return (
    <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
      <Image
        src={`https://flagsapi.com/${jobCountry}/flat/64.png`}
        alt="countrt flag"
        width={16}
        height={16}
        className="rounded-full"
      />

      <p className="body-medium text-dark400_light700">
        {jobCity && `${jobCity}, `}
        {jobState && `${jobState}, `}
        {jobCountry && `${jobCountry}`}
      </p>
    </div>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  const {
    employer_logo: employerLogo,
    employer_website: employerWebsite,
    job_employment_type: jobEmploymentType,
    job_title: jobTitle,
    job_description: jobDescription,
    job_apply_link: jobApplyLink,
    job_city: jobCity,
    job_state: jobState,
    job_country: jobCountry,
  } = job;

  return (
    <section className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
      <div className="flex w-full justify-end sm:hidden">
        <JobLocation
          jobCity={jobCity}
          jobCountry={jobCountry}
          jobState={jobState}
        />
      </div>

      <div className="flex items-center gap-6">
        {employerLogo ? (
          <Link
            href={employerWebsite || "/jobs"}
            className="background-light800_dark400 relative size-16 rounded-xl"
          >
            <Image
              src={employerLogo}
              alt="company logo"
              fill
              className="size-full object-contain p-2 rounded-xl"
            />
          </Link>
        ) : (
          <Image
            src="/images/site-logo.svg"
            alt="default site logo"
            width={64}
            height={64}
            className="rounded-xl"
          />
        )}
      </div>

      <div className="w-full">
        <div className="flex-between flex-wrap gap-2">
          <p className="base-semibold text-dark200_light900">
            {processJobTitle(jobTitle)}
          </p>

          <div className="hiden sm:flex">
            <JobLocation
              jobCity={jobCity}
              jobCountry={jobCountry}
              jobState={jobState}
            />
          </div>
        </div>

        <p className="body-regular text-dark500_light700 mt-2 line-clamp-2">
          {jobDescription?.slice(0, 200)}
        </p>

        <div className="flex-between mt-8 flex-wrap gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/clock-2.svg"
                width={20}
                height={20}
                alt="clock"
              />

              <p className="body-medium text-light-500">{jobEmploymentType}</p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/icons/currency-dollar-circle.svg"
                width={20}
                height={20}
                alt="dollar symbol"
              />

              <p className="body-medium text-light-500">Not disclosed</p>
            </div>
          </div>

          <Link
            href={jobApplyLink || "/jobs"}
            target="_blank"
            className="flex items-center gap-2"
          >
            <p className="body-semibold primary-text-gradient">View job</p>
            <Image
              src="/icons/arrow-up-right.svg"
              width={20}
              height={20}
              alt="arrow up right"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobCard;
