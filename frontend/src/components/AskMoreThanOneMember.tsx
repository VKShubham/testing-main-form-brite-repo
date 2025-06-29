import { useContext } from "react";
import Footer from "../common/Footer";
import AppContext from "../context/AppContext";
import Heading from "../common/Heading";
import { Button } from "@mantine/core";
import useInputChange from "../hooks/useInputChange";

const AskMoreThanOneMember = () => {
  const { setStep } = useContext(AppContext);
  const handleInputChange = useInputChange();

  const handleMember = (isMultipleMember: boolean) => {
    handleInputChange("isMultipleMember", isMultipleMember);
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="Do you have additional team members who need operations hub portal access?" />

        <div className="grid max-[450px]:grid-cols-1 grid-cols-2 items-center gap-5 my-7">
          <Button
            onClick={() => {
              handleMember(false);
              setStep(18);
            }}
            variant="outline"
            className="!px-10 add-button max-[450px]:!px-5 !text-lg !h-[52px]"
          >
            Just the owner(s)
          </Button>
          <Button
            onClick={() => {
              handleMember(true);
              setStep(17);
            }}
            variant="outline"
            className="!px-10 add-button max-[450px]:!px-5 !text-lg !h-[52px]"
          >
            I have team members
          </Button>
        </div>
      </div>
      <Footer
        handleNextStep={() => {}}
        handlePreviousStep={() => {
          setStep(15);
        }}
      />
    </div>
  );
};

export default AskMoreThanOneMember;
