import Hero from "@/components/shared/Hero";
import Categories from "@/components/shared/Categories";
import Sponsor from "@/components/utils/Sponsor";
import Grid from "@/components/utils/Grid";
import InCaseMissed from "@/components/utils/InCaseMissed";
import { useCategoriesList, useCategoryPosts } from "@/api/hooks/useCategories";
import MagazineView from "@/components/utils/MagazineView";
import { useForYouPosts } from "@/api/hooks/useRecommendation";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { data: categoryList, isLoading: categoriesLoading } =
    useCategoriesList();
  const { data: forYouPosts, isLoading: forYouLoading } = useForYouPosts(4);
  const authenticated = false;

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Categories />
      {authenticated && (
        <Grid
          data={forYouPosts}
          isLoading={forYouLoading}
          HeadingTitle="For You"
          HeadingSubTitle="Recommended for you"
          type="News"
        />
      )}

      {categoriesLoading ? (
        <div className="py-12 text-center text-muted-foreground">
          Loading sections...
        </div>
      ) : (
        categoryList
          ?.slice(0, 4)
          .map((category: { id: string; name: string }, index: number) => (
            <div key={category.id}>
              <DynamicCategoryRow name={category.name} />

              <>
                <Sponsor />
                <MagazineView index={index} />
              </>
            </div>
          ))
      )}

      <InCaseMissed />
    </div>
  );
};

export default Home;

const DynamicCategoryRow = ({ name }: { name: string }) => {
  const { ref, inView } = useInView({
    rootMargin: "600px 0px",
    triggerOnce: true,
  });
  const { data, isLoading } = useCategoryPosts(name, 4, inView);

  if (inView && !isLoading && (!data?.posts || data.posts.length === 0)) {
    return null;
  }

  return (
    <div ref={ref}>
      <Grid
        data={data}
        isLoading={!inView || isLoading}
        HeadingTitle={name}
        HeadingSubTitle={`Latest posts and insights in ${name}`}
        type="category"
      />
    </div>
  );
};
