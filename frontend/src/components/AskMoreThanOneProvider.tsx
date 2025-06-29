import { useContext } from "react";
import Footer from "../common/Footer";
import AppContext from "../context/AppContext";
import Heading from "../common/Heading";
import { Button } from "@mantine/core";
import useInputChange from "../hooks/useInputChange";

const AskMoreThanOneProvider = () => {
  const { setStep } = useContext(AppContext);
  const handleInputChange = useInputChange();

  const handleProvider = (isMultipleProvider: boolean) => {
    handleInputChange("isMultipleProvider", isMultipleProvider);
  };

  return (
    <div>
      <div>
        <Heading text="Do You Have More Than One Provider?" />

        <div className="grid grid-cols-2 items-center gap-x-5 my-7">
          <Button
            onClick={() => {
              handleProvider(true);
              setStep(14);
            }}
            variant="outline"
            className="!px-10 !text-lg !h-[52px]"
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              handleProvider(false);
              setStep(15);
            }}
            variant="outline"
            className="!px-10 !text-lg !h-[52px]"
          >
            No
          </Button>
        </div>
      </div>
      <Footer
        handleNextStep={() => {}}
        handlePreviousStep={() => {
          setStep(12);
        }}
      />
    </div>
  );
};

export default AskMoreThanOneProvider;
