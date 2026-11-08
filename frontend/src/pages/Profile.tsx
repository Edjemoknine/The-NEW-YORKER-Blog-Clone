/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import SearchCard from "../components/shared/SearchCard";
import { useQuery } from "@tanstack/react-query";
import { userData } from "@/api/handlers/auth";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";

const Profile = () => {
  const { name } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", name],
    queryFn: () => userData(name!),
  });
  if (isLoading) return <ProfileSkeleton />;
  return (
    <main className="page-shell">
      <header className="page-header flex flex-col items-center gap-6 pb-10 md:flex-row md:items-start md:pb-12">
        <div className="size-40 shrink-0 overflow-hidden rounded-full border border-border bg-muted md:size-48">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="profile picture"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src="https://media.newyorker.com/photos/59097b85019dfc3494ea36f6/1:1/w_320,c_limit/marantz-andrew.png"
              alt="profile picture"
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <p className="page-kicker">Contributor</p>
          <h1 className="page-title">{profile.name}</h1>
          {profile?.bio && (
            <p className="page-description max-w-2xl">{profile.bio}</p>
          )}
        </div>
      </header>
      <section className="mx-auto max-w-5xl divide-y divide-border">
        {profile.posts.map((item: any) => (
          <SearchCard item={item} key={item.id ?? item._id} />
        ))}
      </section>
    </main>
  );
};

export default Profile;
