const Heading = ({ text }: { text: string }) => {
  return (
    <div className="text-center max-[450px]:text-lg !text-2xl font-bold p-5 max-[450px]:p-2 text-color">
      {text}
    </div>
  );
};

export default Heading;
