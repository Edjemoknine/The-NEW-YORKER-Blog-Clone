import { Link } from "react-router-dom";

interface SearchCardProps {
  item: {
    _id: string;
    title?: string;
    desc?: string;
    username?: {
      name: string;
    };
    date?: string;
    image?: string;
  };
}

const SearchCard: React.FC<SearchCardProps> = ({ item }) => {
  return (
    <div className="max-w-5xl w-full">
      <Link to={`/blog/${item._id}`}>
        <div className="flex h-72 w-full py-6 border-b border-neutral-200 gap-10">
          <div className="flex flex-col gap-2 flex-[2]">
            <h3 className="text-xs uppercase text-red-500">
              {/* {item?.categories[0]} */}
            </h3>
            <h2 className="text-xl mb-1">{item?.title}</h2>
            <p className="text- text-neutral-600">{item?.desc}</p>
            <span className="font-bold text-sm">{item?.username?.name}</span>
            <span className="text-xs font-medium text-neutral-600">
              {item?.date}
            </span>
          </div>
          <div className="flex-1 h-full  hidden md:block ">
            <img
              src={item?.image}
              alt="image post"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchCard;
