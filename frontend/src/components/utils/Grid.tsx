/* eslint-disable @typescript-eslint/no-explicit-any */
import Heading from "./Heading";
import GameCard from "../shared/GameCard";
import { NewsCard } from "./NewsCard";

type Props = {
  type: string;
  data: any;
  HeadingTitle: string;
  HeadingSubTitle: string;
  image?: string;
  isLoading?: boolean;
};
const Grid = ({
  type,
  data,
  HeadingTitle,
  HeadingSubTitle,
  image,
  isLoading,
}: Props) => {
  if (isLoading) {
    return (
      <div className="max-w-[90rem] mx-auto px-4 py-12 md:px-6">
        <div className="h-6 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 w-[20rem] bg-muted/50 animate-pulse rounded-xl "
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-[90rem] mx-auto px-4 pb-10 md:px-6">
      <Heading image={image} title={HeadingTitle} paragraph={HeadingSubTitle} />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 my-6 lg:grid-cols-4 gap-6 divide-x2 divide-gray-500">
        {data?.posts?.map((item: any, index: number) => {
          return type === "game" ? (
            <GameCard key={index} />
          ) : (
            <NewsCard post={item} key={index} />
          );
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
