"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { formUrlQuery } from "@/lib/url";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  countriesName: string[];
}

const JobFilters = ({ countriesName }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterParams = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="w-full sm:w-fit">
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={filterParams || undefined}
      >
        <SelectTrigger
          className="w-full body-regular no-focus light-border backgroun-light800_dark300 text-dark500_light700 border px-5 py-2.5 min-h-[56px] sm:min-w-[250px]"
          aria-label="Filters options"
        >
          <div className="line-clamp-1 flex-1 text-left flex items-center gap-5">
            <Image
              src="/icons/location.svg"
              width={20}
              height={20}
              alt="Location"
            />
            <SelectValue placeholder="Select Location" />
          </div>
        </SelectTrigger>

        <SelectContent>
          {countriesName &&
            countriesName?.map((name) => (
              <SelectItem key={name} value={name}>
                {name.length > 20 ? `${name.slice(0, 20)}...` : name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobFilters;
