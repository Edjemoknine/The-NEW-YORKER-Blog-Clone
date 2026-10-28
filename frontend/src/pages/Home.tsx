/* import { fetchPosts } from "@/api/posts";
import Categories from "@/components/shared/Categories";
import Hero from "@/components/shared/Hero";
import Grid from "@/components/utils/Grid";
import InCaseMissed from "@/components/utils/InCaseMissed";
import Sponsor from "@/components/utils/Sponsor";
import View from "@/components/utils/View";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { data: tech } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts({ category: "RAG", limit: 4 }),
  });

  const { data: Saas } = useQuery({
    queryKey: ["saas"],
    queryFn: () => fetchPosts({ category: "AI", limit: 4 }),
  });
  const { data: Finance } = useQuery({
    queryKey: ["Politics"],
    queryFn: () => fetchPosts({ category: "nature", limit: 4 }),
  });
  const { data: Shopping } = useQuery({
    queryKey: ["Books and culture"],
    queryFn: () => fetchPosts({ category: "Books and culture", limit: 4 }),
  });

  return (
    <div>
      <Hero />
      <Categories />
      <Sponsor />
      <Grid
        data={tech}
        HeadingTitle={"Science and Technology"}
        HeadingSubTitle={"Pioneering Innovation and Discovery"}
        type={"Technology"}
      />
      <View
        image={
          "https://media.newyorker.com/photos/663e84418453580e8d8f6e21/2:2/w_960,c_limit/TNY_Seuss_FINAL4.jpg"
        }
        author={"By Hanif Abduraqib"}
        subtitle={"The new yorker interview"}
        title={"diane seuss reckons with what poetry can do"}
        content={
          "The poet discusses her latest collection, 'ModernPoetry' and what her writing practice has to do with grief, romance, and control . "
        }
      />
      <Sponsor />
      <Grid
        data={Saas}
        HeadingTitle={"Puzzles & Games"}
        HeadingSubTitle={"Take a break and play."}
        type={"games"}
      />
      <View
        image={
          "https://media.newyorker.com/photos/6644f80991b937a1a3abebfc/master/w_1600,c_limit/r44287web.gif"
        }
        author={"By Hanif Abduraqib"}
        subtitle={"Onward and Upward with Technology"}
        title={"Can You Read a Book in a Quarter of an Hour?"}
        content={
          "The poet discusses her latest collection, 'ModernPoetry' and what her writing practice has to do with grief, romance, and control . "
        }
      />
      <Sponsor />
      <Grid
        data={Finance}
        HeadingTitle={"Politicts"}
        HeadingSubTitle={"Navigating the Complexities of Governance and Power."}
        type={"politics"}
      />
      <View
        image={
          "https://media.newyorker.com/photos/6647bdda766e17b61bc7b1c9/2:2/w_1600,c_limit/Streep_LobsterWars_08.jpg"
        }
        author={"By Abe Streep"}
        subtitle={"Dispatch"}
        title={"Nova Scotia is Billion-Dollar Lobster Wars"}
        content={
          "How Indigenous fishermen are defending their rights—and corporate profits—in the most lucrative fishery in North America."
        }
      />
      <Grid
        data={Shopping}
        HeadingTitle={"Puzzles & Games"}
        HeadingSubTitle={""}
        type={"game"}
      />

      <InCaseMissed />
    </div>
  );
};

export default Home;
 */

import Hero from "@/components/shared/Hero";
import Categories from "@/components/shared/Categories";
import Sponsor from "@/components/utils/Sponsor";
import Grid from "@/components/utils/Grid";
import View from "@/components/utils/View";
import InCaseMissed from "@/components/utils/InCaseMissed";
import { useCategoriesList, useCategoryPosts } from "@/api/hooks/useCategories";

// A sub-component to handle fetching and rendering a single category row
const DynamicCategoryRow = ({ name }: { name: string }) => {
  const { data, isLoading } = useCategoryPosts(name, 4);

  if (!isLoading && (!data?.posts || data.posts.length === 0)) return null;

  return (
    <Grid
      data={data}
      HeadingTitle={name}
      HeadingSubTitle={`Latest posts and insights in ${name}`}
      type={"category"}
    />
  );
};

const Home = () => {
  // Fetch active categories dynamically from your database/API
  const { data: categoryList, isLoading: categoriesLoading } =
    useCategoriesList();
  console.log(categoryList);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Categories />

      {categoriesLoading ? (
        <div className="py-12 text-center text-muted-foreground">
          Loading sections...
        </div>
      ) : (
        // Dynamically loop through your database categories and render a section for each!
        categoryList
          ?.slice(0, 4)
          .map((category: { id: string; name: string }, index: number) => (
            <div key={category.id}>
              <DynamicCategoryRow name={category.name} />
              {/* Inject a sponsor or editorial view banner every 2 categories */}
              {index === 1 && (
                <>
                  <Sponsor />
                  <View
                    image="https://media.newyorker.com/photos/663e84418453580e8d8f6e21/2:2/w_960,c_limit/TNY_Seuss_FINAL4.jpg"
                    author="By Hanif Abduraqib"
                    subtitle="The New Yorker Interview"
                    title="diane seuss reckons with what poetry can do"
                    content="The poet discusses her latest collection, 'Modern Poetry' and what her writing practice has to do with grief, romance, and control."
                  />
                </>
              )}
            </div>
          ))
      )}

      <InCaseMissed />
    </div>
  );
};

export default Home;
