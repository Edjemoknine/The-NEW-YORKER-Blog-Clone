const View = ({ image, title, author, content, subtitle }) => {
  return (
    <div className="max-w-[90rem] h-[90vh] bg-black my-16 mx-auto grid md:grid-cols-2">
      <div className="flex  flex-col gap-6 max-w-md mx-auto py-10 justify-center text-white text-center">
        <p className="font-grotesk">{subtitle}</p>
        <h3 className="text-4xl font-medium font-grotesk">{title}</h3>
        <p className="">{content}</p>
        <span className="font-medium">{author}</span>
      </div>
      <div className="overflow-hidden h-full w-full">
        <img src={image} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default View;
