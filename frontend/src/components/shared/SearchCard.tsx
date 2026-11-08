import { Link } from "react-router-dom";
import type { SearchCardProps } from "@/types/posts";

const SearchCard: React.FC<SearchCardProps> = ({ item }) => {
  const date = item.date == null ? null : new Date(item.date);
  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString()
      : "Date unavailable";

  return (
    <article className="w-full">
      <Link to={`/blog/${item.id}`}>
        <div className="flex w-full flex-col-reverse gap-5 border-b border-border py-6 md:h-72 md:flex-row md:gap-10">
          <div className="flex flex-[2] flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {item.categories?.[0] ?? "Uncategorized"}
            </h3>
            <h2 className="mb-1 font-editorial text-2xl font-semibold leading-snug tracking-tight text-foreground">
              {item.title}
            </h2>
            <p className="leading-6 text-muted-foreground">{item.desc}</p>
            <span className="mt-auto pt-2 text-sm font-semibold text-foreground">
              By {item.username?.name ?? "Staff Writer"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          <div className="h-48 flex-1 overflow-hidden rounded-sm bg-muted md:h-full">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title ?? "Story"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default SearchCard;
