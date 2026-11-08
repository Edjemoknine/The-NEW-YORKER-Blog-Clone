

const Sponsor = () => {
  return (
    <aside className="mx-auto flex w-fit max-w-3xl items-center gap-3 px-4 py-6 text-sm text-muted-foreground">
      <img
        src="https://media.newyorker.com/photos/65b2c4913a23f17e3cba58e1/master/w_120,c_limit/TNYStore_ticker_art_02%20copy.png"
        className="w-10 h-10 object-contain"
        alt=""
      />
      <p>
        Find new offerings in The New Yorker Store, including limited-edition
        totes.
      </p>
      <a
        className="shrink-0 border-b border-transparent font-semibold text-primary transition-colors hover:border-primary"
        href="#"
      >
        Browse and buy
      </a>
    </aside>
  );
};

export default Sponsor;
