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
