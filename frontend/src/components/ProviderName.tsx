import { useContext } from "react";
import useInputChange from "../hooks/useInputChange";
import AppContext from "../context/AppContext";
import Heading from "../common/Heading";
import { TextInput } from "@mantine/core";
import Footer from "../common/Footer";

const ProviderName = () => {
  const handleInputChange = useInputChange();
  const { formData, setStep } = useContext(AppContext);

  return (
    <div>
      <Heading text="Provider Full Name" />
      <div className="grid grid-cols-2 gap-x-5 my-5">
        <TextInput
          label="First Name"
          value={formData?.providerFirstName}
          placeholder="First Name"
          onChange={(e) => {
            handleInputChange("providerFirstName", e.target.value);
          }}
        />
        <TextInput
          value={formData?.providerLastName}
          onChange={(e) => {
            handleInputChange("providerLastName", e.target.value);
          }}
          label="Last Name"
          placeholder="Last Name"
        />
      </div>
      <Footer
        handleNextStep={() => {
          setStep(11);
        }}
        handlePreviousStep={() => {
          if (formData?.isMultipleLocation) {
            setStep(9);
          } else {
            setStep(8);
          }
        }}
      />
    </div>
  );
};

export default ProviderName;
