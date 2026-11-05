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
  showHeading?: boolean;
};
const Grid = ({
  type,
  data,
  HeadingTitle,
  HeadingSubTitle,
  image,
  isLoading,
  showHeading = true,
}: Props) => {
  if (isLoading) {
    return (
      <section className="max-w-[90rem] mx-auto px-4 pb-10 md:px-6">
        {showHeading && (
          <Heading
            image={image}
            title={HeadingTitle}
            paragraph={HeadingSubTitle}
          />
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 my-6 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/10] rounded-sm bg-muted/50" />
              <div className="mt-4 h-3 w-1/4 rounded bg-muted" />
              <div className="mt-3 h-5 w-full rounded bg-muted" />
              <div className="mt-2 h-5 w-4/5 rounded bg-muted" />
              <div className="mt-3 h-4 w-full rounded bg-muted/70" />
              <div className="mt-2 h-4 w-3/4 rounded bg-muted/70" />
              <div className="mt-5 h-8 border-t border-border/20" />
            </div>
          ))}
        </div>
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
