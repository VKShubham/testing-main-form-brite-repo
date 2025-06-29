import { useContext, useState } from "react";
import Footer from "../common/Footer";
import AppContext from "../context/AppContext";
import Thumb from "../components/Thumb";
import Heading from "../common/Heading";

const PracticeMarkup = () => {
  const { setStep, formData } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false);
  formData.commission = formData.commission || 10;

  const handleNextStep = () => {
    setShowPopup(true);
  };

  const handleContinue = () => {
    setShowPopup(false);
    setStep(14);
  };

  return (
    <div className="container-home bg-main ">
      <Heading text=" Enable LabCorp Test Ordering & Set Your Practice Markup"></Heading>

      <div className="max-h-[calc(100vh-370px)] mx-10 mb-5 overflow-y-auto overflow-x-hidden ">
        <div className="flex justify-center w-full">
          <div style={{ padding: '50% 0 0', position: 'relative', width: '100%', maxWidth: '70rem', scale: '0.9',marginTop:'-10px' }}>
            <iframe
              src="https://player.vimeo.com/video/1085685345?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&autoplay=1"
              frameBorder="0"
              allow="autoplay; fullscreen"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="Hormone Testing_ When Results Vary"
            ></iframe>
          </div>
        </div>
        <div
          style={{ background: '#e5e7ea' }}
          className=" mt-2 mb-8 my-4 px-6 py-4 rounded-md mx-4  text-base text-black"
        >
          You can now order LabCorp tests directly through BRITE at significantly discounted rates. This powerful integration—allows your patients to save hundreds on lab testing. Behind the scenes, we’ve done the heavy lifting to secure low pricing and build the infrastructure. Simply set your practice markup below to determine how much commission you'd like to earn per test order.
        </div>  

        <div className="w-full">
          <Thumb />
        </div>
      </div>

      <Footer handleNextStep={handleNextStep} handlePreviousStep={() => setStep(12)} />

      { showPopup&& (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)]">
          <div className="bg-white rounded-md p-6 max-w-[400px] text-center text-black z-1000" >
      

            <div
          className=" mt-5 mb-5 my-4 px-6 py-4 rounded-md mx-4  text-base text-black"
          >
          You&apos;ve selected apractice markup of <strong>{formData.commission}%</strong> for LabCorp test orders.
        </div>
            <div className="flex gap-2 mt-4 justify-between">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-400 text-white px-3 py-1 rounded text-sm">
                Go Back to Adjust
              </button>
              <button
                onClick={handleContinue}
                className="bg-[#4fb4a5] text-white px-3 py-1 rounded text-sm">
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeMarkup;