/* eslint-disable @typescript-eslint/no-explicit-any */
import Heading from "./Heading";
import Card from "./Card";
import GameCard from "../shared/GameCard";

type Props = {
  type: string;
  data: any;
  HeadingTitle: string;
  HeadingSubTitle: string;
  image: string;
};
const Grid = ({ type, data, HeadingTitle, HeadingSubTitle, image }: Props) => {
  return (
    <div className="max-w-[90rem] mx-auto px-4 pb-10 md:px-6">
      <Heading image={image} title={HeadingTitle} paragraph={HeadingSubTitle} />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 my-6 lg:grid-cols-4 gap-6 divide-x2 divide-gray-500">
        {data?.posts?.map((item: any, index: number) => {
          return type === "game" ? (
            <GameCard key={index} />
          ) : (
            <Card item={item} key={index} />
          );
        })}
      </div>
      {data?.posts?.length == 0 && (
        <div className="text-xl font-grotesk text-center w-full">
          No Posts related to this category
        </div>
      )}
    </div>
  );
};

export default Grid;
