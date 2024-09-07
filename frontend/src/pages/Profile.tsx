import { useParams } from "react-router-dom";
import SearchCard from "../components/shared/SearchCard";
import { userData } from "@/api/FetchPots";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const { name } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", name],
    queryFn: () => userData(name!),
  });

  if (isLoading) return <div>loading...</div>;
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
            {/* Andrew Marantz, a staff writer, has contributed to The New Yorker
            since 2011, writing extensively about technology, social media,
            politics, and the press, and also about comedy and pop culture. He
            has written about virtual-reality narratives, hip-hop purism, and
            the “Truman Show” delusion, plus dozens of Talk of the Town pieces.
            He is the author of “Antisocial: Online Extremists, Techno-Utopians,
            and the Hijacking of the American Conversation.” */}
          </p>
        </div>
      </div>
      {profile.posts.map((item) => (
        <SearchCard item={item} key={item.id} />
      ))}
    </div>
  );
};

export default Profile;
