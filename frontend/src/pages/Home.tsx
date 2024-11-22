import { fetchPosts } from "@/api/FetchPots";
import Categories from "@/components/shared/Categories";
import Hero from "@/components/shared/Hero";
import Grid from "@/components/utils/Grid";
import InCaseMissed from "@/components/utils/InCaseMissed";
import Sponsor from "@/components/utils/Sponsor";
import View from "@/components/utils/View";
import { useQuery } from "@tanstack/react-query";
export const data = [
  {
    id: 1,
    title: "  Faux ScarJo and the Descent of the A.I. Vultures",
    author: "By Kyle Chayka",
    category: "Politics and debates",
    date: "May 25, 2024",
    description:
      " OpenAI’s snafu over its “Her”-like voice assistant might be funny if it didn’t portend a larger crisis in the integrity of digital information",

    image:
      "https://media.newyorker.com/photos/664cb11d23865d8369f5e627/16:9/w_960,c_limit/r44325.jpg",
  },
  {
    id: 2,
    title: "  Faux ScarJo and the Descent of the A.I. Vultures",
    author: "By Kyle Chayka",
    category: "Politics and debates",
    date: "May 25, 2024",
    description:
      " OpenAI’s snafu over its “Her”-like voice assistant might be funny if it didn’t portend a larger crisis in the integrity of digital information",

    image:
      "https://media.newyorker.com/photos/664cb11d23865d8369f5e627/16:9/w_960,c_limit/r44325.jpg",
  },
  {
    id: 3,
    title: "  Faux ScarJo and the Descent of the A.I. Vultures",
    author: "By Kyle Chayka",
    category: "Politics and debates",
    date: "May 25, 2024",
    description:
      " OpenAI’s snafu over its “Her”-like voice assistant might be funny if it didn’t portend a larger crisis in the integrity of digital information",

    image:
      "https://media.newyorker.com/photos/664cb11d23865d8369f5e627/16:9/w_960,c_limit/r44325.jpg",
  },
  {
    id: 4,
    title: "  Faux ScarJo and the Descent of the A.I. Vultures",
    author: "By Kyle Chayka",
    category: "Politics and debates",
    date: "May 25, 2024",
    description:
      " OpenAI’s snafu over its “Her”-like voice assistant might be funny if it didn’t portend a larger crisis in the integrity of digital information",

    image:
      "https://media.newyorker.com/photos/664cb11d23865d8369f5e627/16:9/w_960,c_limit/r44325.jpg",
  },
];

const Home = () => {
  const { data: tech } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts({ category: "Tech", limit: 4 }),
  });

  const { data: Saas } = useQuery({
    queryKey: ["saas"],
    queryFn: () => fetchPosts({ category: "Saas" ,limit:4}),
  });
  const { data: Finance } = useQuery({
    queryKey: ["Politics"],
    queryFn: () => fetchPosts({ category: "Politics", limit: 4 }),
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
        image={
          "https://media.newyorker.com/photos/64e79101eeb2b9a4560ab47c/master/pass/HP-Header-Talk.gif"
        }
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
        image={
          "https://media.newyorker.com/photos/64e79101eeb2b9a4560ab47c/master/pass/HP-Header-Talk.gif"
        }
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
        image={
          "https://media.newyorker.com/photos/64e79101eeb2b9a4560ab47c/master/pass/HP-Header-Talk.gif"
        }
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
        image={
          "https://media.newyorker.com/photos/64e79101eeb2b9a4560ab47c/master/pass/HP-Header-Talk.gif"
        }
        type={"game"}
      />
      <InCaseMissed />
      <Grid
        data={Shopping}
        HeadingTitle={"Puzzles & Games"}
        HeadingSubTitle={"Take a break and play."}
        image={
          "https://media.newyorker.com/photos/64e79101eeb2b9a4560ab47c/master/pass/HP-Header-Talk.gif"
        }
        type={"news"}
      />
    </div>
  );
};

export default Home;
