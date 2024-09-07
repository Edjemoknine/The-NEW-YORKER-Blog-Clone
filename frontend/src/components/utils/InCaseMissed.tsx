const InCaseMissed = () => {
  return (
    <div className="max-w-[90rem] mx-auto px-6 my-10">
      <h1 className="text-xl font-normal font-grotesk mb-10 italic text-center">
        In Case you Missed It
      </h1>

      <div className="grid sm:grid-cols-2 gap-6 xl:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((item) => (
            <div key={item} className="flex items-center gap-6">
              <img
                src="https://media.newyorker.com/photos/66466146eb3f8c698e404f9c/1:1/w_320,c_limit/Witt-PCH-1.jpg"
                alt=""
                className="rounded w-16 h-16 object-contain"
              />
              <div className="flex flex-col">
                <h3 className="text-red-500 font-thin font-grotesk uppercase">
                  PHOTO BOUTH
                </h3>
                <p className="font-light text-sm">
                  The View from Palastinian America
                </p>
                <span className="text-xs font-semibold">BY Sarah Stillman</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InCaseMissed;
