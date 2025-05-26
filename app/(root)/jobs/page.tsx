import React from "react";

import JobCard from "@/components/cards/JobCard";
import { StateSkeleton } from "@/components/DataRenderer";
import JobFilters from "@/components/filters/JobFilters";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { getCountries, getJobs } from "@/lib/actions/job.action";

const Jobs = async ({ searchParams }: RouteParams) => {
  const { query, filter, page } = await searchParams;

  const parsedIntPage = parseInt(page) || 1;

  const { data: countries } = await getCountries();
  const countriesName = countries.map(
    (country: Country) => country.name.common
  );

  const { data: jobs } = await getJobs({
    query: query || "developer",
    filter: filter || "new york",
    page: Number(page) || 1,
  });

  return (
    <>
      <section className="w-full flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Jobs</h1>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.JOBS}
          imageSrc="/icons/search.svg"
          placeholder="Job title, Company, or Keywords"
        />

        <JobFilters countriesName={countriesName} />
      </section>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {jobs?.data?.length > 0 ? (
          jobs?.data
            ?.filter((job: Job) => job.job_title)
            .map((job: Job) => <JobCard key={job.job_id} job={job} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            <StateSkeleton
              image={{
                light: "/images/light-illustration.png",
                dark: "/images/dark-illustration.png",
                alt: "Empty state illustration",
              }}
              title="No Available Job Found"
              message="Oops!! sorry no job found in this area, please try  again next time."
            />
          </div>
        )}
      </section>

      {jobs.data.length > 0 && (
        <Pagination page={parsedIntPage} isNext={jobs.data.length === 10} />
      )}
    </>
  );
};

export default Jobs;
