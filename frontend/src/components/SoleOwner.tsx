import { Button } from "@mantine/core";
import useInputChange from "../hooks/useInputChange";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import Footer from "../common/Footer";
import Heading from "../common/Heading";

const SoleOwner = () => {
  const handleInputChange = useInputChange();
  const { setStep } = useContext(AppContext);

  const handleOwnerType = (isSoleOwner: boolean) => {
    handleInputChange("isSoleOwner", isSoleOwner);
  };

  return (
    <div className="container-home bg-main">
      <Heading text="Are you the sole owner, or is there more than one owner?" />
      <div className="grid sm:grid-cols-2 max-w-[650px] mx-auto max-[450px]:grid gap-y-2 items-center gap-x-5 my-5 justify-center">
        <Button
          onClick={() => {
            handleOwnerType(true);
            setStep(9);
          }}
          variant="outline"
          className="!px-10 !text-lg !h-[52px] hover:!bg-[#45bda709] !border-[#45bda6] !text-[#45bda6] !border-[3px]"
        >
          Sole Owner
        </Button>
        <Button
          onClick={() => {
            handleOwnerType(false);
            setStep(8);
          }}
          variant="outline"
          className="!px-10 !text-lg !h-[52px] hover:!bg-[#45bda709] !border-[#45bda6] !text-[#45bda6] !border-[3px]"
        >
          More Than One Owner
        </Button>
      </div>

      <Footer
        handleNextStep={() => {}}
        handlePreviousStep={() => {
          setStep(6);
        }}
      />
    </div>
  );
};

export default SoleOwner;
