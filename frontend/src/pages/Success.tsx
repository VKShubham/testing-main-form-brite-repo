const Success = () => {
  return (
    <div>
      <img
        className="h-screen w-full object-cover max-[700px]:hidden"
        src="./payment_success_desktop.jpg"
        alt="Payment Success Desktop"
      />
      <img
        className="h-screen w-full object-cover min-[700px]:hidden"
        src="./payment_success_mobile.jpg"
        alt="Payment Success Mobile"
      />
    </div>
  );
};

export default Success;
