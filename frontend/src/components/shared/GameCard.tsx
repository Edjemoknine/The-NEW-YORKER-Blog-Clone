const GameCard = () => {
  return (
    <div className="rounded-2xl p-6 flex text-center gap-4 group flex-col items-center justify-between bg-[#84C9FF]">
      <div>
        <h3 className="text-lg font-grotesk font-light italic">
          The CROSSWORD
        </h3>
        <p className="text-xs ">
          A puzzele that ranges in difficulty, with the occasional theme.
        </p>
      </div>
      <div className="">
        <picture className="ResponsiveImagePicture-cWuUZO dUOtEa responsive-image">
          <source
            media="(max-width: 767px)"
            srcSet="https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_120,c_limit/TNY_Crossword.gif 120w, https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_240,c_limit/TNY_Crossword.gif 240w, https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_320,c_limit/TNY_Crossword.gif 320w, https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_640,c_limit/TNY_Crossword.gif 640w"
            sizes="100vw"
          />
          <source
            media="(min-width: 768px)"
            srcSet="https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_120,c_limit/TNY_Crossword.gif 120w, https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_240,c_limit/TNY_Crossword.gif 240w, https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_320,c_limit/TNY_Crossword.gif 320w, https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_640,c_limit/TNY_Crossword.gif 640w"
            sizes="100vw"
          />
          <img
            alt="An owl holding a large blue pencil stands as different crossword puzzles scroll across its stomach."
            className="ResponsiveImageContainer-eybHBd fptoWY responsive-image__image"
            src="https://media.newyorker.com/photos/6526b4e83ecac81f962383f4/4:3/w_768,c_limit/TNY_Crossword.gif"
          />
        </picture>
      </div>
      <a
        href="#"
        className="text-xs font-semibold group-hover:border-black   border-b-2  border-transparent"
      >
        Solve the latest puzzele
      </a>
    </div>
  );
};

export default GameCard;
