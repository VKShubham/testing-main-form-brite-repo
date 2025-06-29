import { useContext, useState } from "react";
import Footer from "../common/Footer";
import AppContext from "../context/AppContext";
import { showToast } from "../common/toast";
import Heading from "../common/Heading";

const OperationHubMessage = () => {
  const { setStep } = useContext(AppContext);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="container-home bg-main ">
      <div className=" max-[500px]:!px-2 font-bold text-center text-3xl max-[450px]:text-xl text-[#d1d1d1]">
        <Heading text=" Introduction to the Operations Hub"></Heading>
      </div>
      <div className="max-h-[calc(100vh-370px)] mx-10 mb-5 overflow-y-auto overflow-x-hidden ">

        <div className="flex justify-center w-full">
          <div style={{ padding: '50% 0 0', position: 'relative', width: '100%', maxWidth: '70rem', scale: '0.9', marginTop: "-10px" }}>
            <iframe
              src="https://player.vimeo.com/video/1085684641?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&autoplay=1"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              title="Hormone Testing_ When Results Vary"
            ></iframe>

            {/* <video  src="https://player.vimeo.com/video/1043032001?h=48520cb991&badge=0&autopause=0&player_id=0&app_id=58479"></video> */}
          </div>
        </div>


        <div
          style={{ background: '#e5e7ea' }}
          className=" mt-2 mb-8 my-4 px-6 py-4 rounded-md mx-4  text-base text-black"
        >

          <h2 className="text-2xl font-semibold mb-4">Roles in the Operations Hub</h2>

          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Assistant:</strong> Manages patient invites, registration status, support tickets, and billing actions.</li>
            <li><strong>Finance:</strong> Views and exports transaction data, charges, and payables for accounting and audit purposes.</li>
            <li><strong>Analytics:</strong> Accesses reports and dashboards related to patient activity and location performance.</li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            <strong>Note:</strong> All owners automatically receive full Operations Hub access with all roles and all locations.
          </p>


          <p className="mt-2 text-sm">
            You can assign one or more roles and one or more locations to each team member.
          </p>

        </div>
        <div className="flex items-center overflow-auto mb-3 ml-5">
          <input
            type="checkbox"
            id="checkbox"
            className="cursor-pointer"
            checked={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <label htmlFor="checkbox" className="ml-2 cursor-pointer leading-relaxed text-sm lg:text-[15px]">
            I acknowledge that I have read and understand the purpose of the
            Operations Hub for managing my franchise operations.
          </label>
        </div>


      </div>
      <Footer
        handleNextStep={() => {
          isChecked
            ? setStep(16)
            : showToast(
              "Please acknowledge that you have read and understand the purpose of the Operations Hub before proceeding",
              "error"
            );
        }}
        handlePreviousStep={() => setStep(14)}
      />
    </div>
  );
};

export default OperationHubMessage;
