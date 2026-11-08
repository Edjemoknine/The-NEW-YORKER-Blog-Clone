/* eslint-disable @typescript-eslint/no-explicit-any */
import Heading from "./Heading";
import { NewsCard } from "./NewsCard";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import type { PostCardPost } from "@/types/posts";

const Grid = ({
  data,
  HeadingTitle,
  HeadingSubTitle,
  image,
  isLoading,
  showHeading = true,
}: {
  data?: { posts?: PostCardPost[] };
  HeadingTitle: string;
  HeadingSubTitle: string;
  image?: string;
  isLoading?: boolean;
  showHeading?: boolean;
}) => {
  if (isLoading) {
    return (
      <section className="px-4 pb-10 md:px-6">
        {showHeading && (
          <Heading
            image={image}
            title={HeadingTitle}
            paragraph={HeadingSubTitle}
          />
        )}
        <GridSkeleton />
      </section>
    );
  }
  return (
    <div className="max-w-[90rem] mx-auto px-4 pb-10 md:px-6">
      {showHeading && (
        <Heading
          image={image}
          title={HeadingTitle}
          paragraph={HeadingSubTitle}
        />
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 my-6 lg:grid-cols-4 gap-6 divide-x2 divide-gray-500">
        {data?.posts?.map((item, index) => {
          return <NewsCard post={item} key={index} />;
        })}
      </div>
      {data?.posts?.length === 0 ? (
        <div className="text-xl font-grotesk text-center w-full">
          No Posts related to this category
        </div>
      ) : null}
    </div>
  );
};

export default Grid;
