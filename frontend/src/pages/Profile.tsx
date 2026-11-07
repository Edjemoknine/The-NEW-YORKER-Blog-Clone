/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import SearchCard from "../components/shared/SearchCard";
import { useQuery } from "@tanstack/react-query";
import { userData } from "@/api/handlers/auth";

const ProfileSkeleton = () => (
  <main
    className="min-h-screen max-w-[90rem] mx-auto px-4 py-10 pt-40 md:px-6"
    aria-busy="true"
    aria-label="Loading profile"
  >
    <span className="sr-only" role="status">
      Loading profile
    </span>
    <div aria-hidden="true" className="motion-reduce:animate-none animate-pulse">
      <section className="flex flex-col items-center gap-6 border-b border-neutral-200 pb-16 md:flex-row md:items-start">
        <div className="h-52 w-52 shrink-0 rounded-full bg-neutral-200" />
        <div className="w-full flex-1 space-y-4 pt-2">
          <div className="h-12 w-3/4 max-w-md rounded bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-5/6 rounded bg-neutral-200" />
            <div className="h-4 w-2/3 rounded bg-neutral-200" />
          </div>
        </div>
      </section>

      <section className="max-w-5xl" aria-label="Loading profile posts">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex h-72 gap-10 border-b border-neutral-200 py-6"
          >
            <div className="flex flex-[2] flex-col gap-4">
              <div className="h-3 w-24 rounded bg-neutral-200" />
              <div className="h-6 w-4/5 rounded bg-neutral-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-neutral-200" />
                <div className="h-4 w-5/6 rounded bg-neutral-200" />
                <div className="h-4 w-2/3 rounded bg-neutral-200" />
              </div>
              <div className="mt-auto h-4 w-28 rounded bg-neutral-200" />
            </div>
            <div className="hidden flex-1 rounded bg-neutral-200 md:block" />
          </div>
        ))}
      </section>
    </div>
  </main>
);

const Profile = () => {
  const { name } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", name],
    queryFn: () => userData(name!),
  });
  if (isLoading) return <ProfileSkeleton />;
  return (
    <div className="  pt-40  max-w-[90rem] mx-auto px-4 md:px-6 py-10">
      <div className=" flex gap-6 flex-col border-b border-neutral-200 pb-16 md:flex-row items-center md:items-start">
        <div className="h-52 w-52 rounded-full bg-sky-200 overflow-hidden">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="profile picture"
              className="h-full w-full  "
            />
          ) : (
            <img
              src="https://media.newyorker.com/photos/59097b85019dfc3494ea36f6/1:1/w_320,c_limit/marantz-andrew.png"
              alt="profile picture"
              className="h-full w-full  "
            />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-5xl mb-3 font-light font-grotesk">
            {profile.name}
          </h2>
          <p className="">
            {profile.bio}
            Andrew Marantz, a staff writer, has contributed to The New Yorker
            since 2011, writing extensively about technology, social media,
            politics, and the press, and also about comedy and pop culture. He
            has written about virtual-reality narratives, hip-hop purism, and
            the “Truman Show” delusion, plus dozens of Talk of the Town pieces.
            He is the author of “Antisocial: Online Extremists, Techno-Utopians,
            and the Hijacking of the American Conversation.”
          </p>
        </div>
      </div>
      {profile.posts.map((item: any) => (
        <SearchCard item={item} key={item.id} />
      ))}
    </div>
  );
};

export default Profile;
