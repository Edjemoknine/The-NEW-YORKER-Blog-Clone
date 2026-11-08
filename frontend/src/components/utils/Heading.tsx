const Heading = ({ title, paragraph, image }: { title: string; paragraph: string; image?: string }) => {
  return (
    <div className="border-t border-border pb-4 pt-8 text-center">
      {image && image !== "" && (
        <img
          src={image}
          alt="Image"
          className="mx-auto my-4 h-20 object-contain"
        />
      )}
      <h2 className="font-editorial text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-1 text-base italic text-muted-foreground">
        {" "}
        {paragraph}
      </p>
    </div>
  );
};

export default Heading;
