import { useContext } from "react";
import useInputChange from "../hooks/useInputChange";
import AppContext from "../context/AppContext";
import Heading from "../common/Heading";
import { TextInput } from "@mantine/core";
import Footer from "../common/Footer";

const ProviderEmail = () => {
  const handleInputChange = useInputChange();
  const { formData, setStep } = useContext(AppContext);

  return (
    <div>
      <Heading text="Provider Email Address" />
      <div className="my-5">
        <TextInput
          label="Email Address"
          type="email"
          value={formData?.providerEmail}
          placeholder="example@example.com"
          onChange={(e) => {
            handleInputChange("providerEmail", e.target.value);
          }}
        />
      </div>
      <Footer
        handleNextStep={() => {
          setStep(12);
        }}
        handlePreviousStep={() => {
          setStep(10);
        }}
      />
    </div>
  );
};

export default ProviderEmail;
