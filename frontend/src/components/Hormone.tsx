import { useContext, useState } from "react";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import useInputChange from "../hooks/useInputChange";
import { showToast } from "../common/toast";

const Hormone = () => {
  const { setStep } = useContext(AppContext);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const handleInputChange = useInputChange();

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    handleInputChange("hormone", option);
    setStep(15);
  };

  return (
     <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="In addition to hormones, what will your practice pay for?" />
        <div className="text-base max-[450px]:text-sm text-center pb-3 text-color">
        Let us know whether the practice will also be paying for Shipping Charges, and/or Other Medications and Testing.
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              handleOptionSelect(" Practice Will Pay for Hormones");
            }}
            className={`!px-2 sm:!px-5 ${selectedOption === " Practice Will Pay for Hormones"
                ? "!bg-[#45bda6] !text-black"
                : ""
              } cursor-pointer rounded-xl sm:text-sm add-button py-2 !font-bold !min-h-[52px] !mb-5 max-[450px]:!px-5 md:mt-5 max-[450px]:!text-sm max-[450px]:!min-h-[40px]`}
          >
           Practice Will Pay for Hormones
          </button>

          <button
            onClick={() => handleOptionSelect("Practice Will Pay for Hormones & Shipping")}
            className={`!px-2 sm:!px-5 ${selectedOption === "Practice Will Pay for Hormones & Shipping"
                ? "!bg-[#45bda6] !text-black"
                : ""
              } cursor-pointer rounded-xl sm:text-sm add-button py-2 !font-bold !min-h-[52px] !mb-5 max-[450px]:!px-5 md:mt-5 max-[450px]:!text-sm max-[450px]:!min-h-[40px]`}
          >
          Practice Will Pay for Hormones & Shipping
          </button>

          <button
            onClick={() => {
              handleOptionSelect(
                "Practice Will Pay for Hormones, Other Medications, Testing, & Shipping"
              );
            }}
            className={`!px-2 sm:!px-5 ${selectedOption ===
                "Practice Will Pay for Hormones, Other Medications, Testing, & Shipping"
                ? "!bg-[#45bda6] !text-black"
                : ""
              } cursor-pointer rounded-xl sm:text-sm add-button py-2 !font-bold !min-h-[52px] !mb-5 max-[450px]:!px-5 md:mt-5 max-[450px]:!text-sm max-[450px]:!min-h-[40px]`}
          >
          Practice Will Pay for Hormones, Other Medications, Testing, & Shipping
          </button>
        </div>
      </div>
      <Footer
        handleNextStep={() => {
          if (!selectedOption) {
            showToast("Please select an option before proceeding.", "error");
            return;
          }
          setStep(15);
        }}
        handlePreviousStep={() => setStep(13)}
      />
    </div>
  );
};

export default Hormone;
