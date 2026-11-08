/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchForm from "@/components/forms/SearchForm";
import SearchCard from "../components/shared/SearchCard";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/api/handlers/posts";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/api/handlers/recommendations";

const Search = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const lastTrackedSearch = useRef<{ query: string; postId: string } | null>(
    null,
  );

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isSuccess } = useQuery({
    queryKey: ["serachPosts", debouncedSearch],
    queryFn: () =>
      fetchPosts({ search: debouncedSearch, pageParam: 1, limit: 10 }),
  });

  useEffect(() => {
    const query = debouncedSearch.trim();
    if (!query) {
      lastTrackedSearch.current = null;
      return;
    }

    if (lastTrackedSearch.current?.query !== query) {
      lastTrackedSearch.current = null;
    }

    const firstPostId = data?.posts?.[0]?._id ?? data?.posts?.[0]?.id;
    if (!isSuccess || !firstPostId) return;

    if (
      lastTrackedSearch.current?.query === query &&
      lastTrackedSearch.current.postId === firstPostId
    ) {
      return;
    }

    lastTrackedSearch.current = { query, postId: firstPostId };
    void trackEvent({
      eventType: "search",
      searchQuery: query,
      postId: firstPostId,
    });
  }, [data, debouncedSearch, isSuccess]);

  return (
    <main className="page-shell">
      <header className="page-header text-center">
        <p className="page-kicker">Explore the archive</p>
        <h1 className="page-title">Search stories from News Nexus</h1>
        <p className="page-description mx-auto">
          Find reporting, culture, fiction, and ideas from across the magazine.
        </p>
        <div className="mt-8 border-y border-border py-8">
          <SearchForm term={search} setTerm={setSearch} />
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-3">
        {data?.posts?.map((item: any) => (
          <SearchCard item={item} key={item._id ?? item.id} />
        ))}
      </div>
    </main>
  );
};

export default Search;
