/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchForm from "@/components/shared/SearchForm";
import SearchCard from "../components/shared/SearchCard";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/api/handlers/posts";
import { useEffect, useState } from "react";

const Search = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data } = useQuery({
    queryKey: ["serachPosts", debouncedSearch],
    queryFn: () =>
      fetchPosts({ search: debouncedSearch, pageParam: 1, limit: 10 }),
  });

  return (
    <div className="px-4 md:px-6">
      <div className="pt-40 py-10">
        <h1 className="xl:text-6xl sm:text-4xl text-3xl  font-grotesk text-center mb-6 ">
          Search stories from News Nexus
        </h1>
        <div className="border-t border-b py-10">
          <SearchForm term={search} setTerm={setSearch} />
        </div>
      </div>

      <div className="flex-col flex gap-3 px-8">
        {data?.posts?.map((item: any) => (
          <SearchCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default Search;
