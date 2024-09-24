import { Link } from "react-router-dom";

type Props = {
  item: {
    _id: string;
    title: string;
    desc: string;
    username: {
      name: string;
    };
    image: string;
  };
};
const Card = ({ item }: Props) => {
  return (
    <Link to={`/blog/${item?._id}`}>
      <div className="flex flex-col gap-2">
        <div className="min-h-64 w-full relative">
          <img
            src={item?.image}
            alt="img"
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>
        <h3 className="font-grotesk font-semibold break-words text-xl text-gray-700">
          {item?.title}
        </h3>
        <p className="font-light text-sm line-clamp-3">{item?.desc}</p>
        <span className="text-[12px] font-semibold">
          {item?.username?.name}
        </span>
      </div>
    </Link>
  );
};

export default Card;
