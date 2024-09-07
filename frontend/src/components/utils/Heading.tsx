const Heading = ({ title, paragraph, image }) => {
  return (
    <div className="pb-4 border-t pt-8 border-gray-500 text-center">
      {image == !"" && (
        <img
          src={image}
          alt="Image"
          className=" h-20 my-4 object-contain mx-auto"
        />
      )}
      <h2 className="text-3xl font-medium uppercase font-grotesk">{title}</h2>
      <p className="italic font-grotesk text-lg font-extralight">
        {" "}
        {paragraph}
      </p>
    </div>
  );
};

export default Heading;
