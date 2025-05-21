import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imageUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  imageStyles?: string;
  isAuthor?: boolean;
  titleStyles?: string;
}

const Metric = ({
  imageUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  imageStyles,
  isAuthor,
  titleStyles,
}: Props) => {
  const MetricContent = (
    <>
      <Image
        src={imageUrl}
        width={16}
        height={16}
        alt={alt}
        className={`rounded-full object-contain ${imageStyles}`}
      />

      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`${titleStyles} small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex-center gap-1">
      {MetricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{MetricContent}</div>
  );
};

export default Metric;
