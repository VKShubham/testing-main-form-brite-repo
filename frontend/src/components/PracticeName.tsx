import { TextInput } from "@mantine/core";
import Heading from "../common/Heading";
import useInputChange from "../hooks/useInputChange";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import useValidation from "../hooks/useValidation";
import Footer from "../common/Footer";

const PracticeName = () => {
  const handleInputChange = useInputChange();
  const { formData, setStep } = useContext(AppContext);

  const validationRules = {
    practiceName: {
      required: true,
      message: "Practice name is required.",
      pattern: {
        value: /^[A-Za-z\s]{3,}$/, // Ensures at least 3 letters (including spaces)
        message: "Practice name must be at least 3 letters long.",
      },
    },
  };

  const { errors, validateFields, clearError } = useValidation(validationRules);

  const handleNextStep = () => {
    if (validateFields(formData)) {
      setStep(2);
    }
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10">
        <Heading text="Practice Name" />
        <div className="mb-5">
          <TextInput
            value={formData?.practiceName}
            error={errors?.practiceName}
            placeholder="e.g., Optimal Hormone & Wellness Institute"
            onChange={(e) => {
              handleInputChange("practiceName", e.target.value);
              clearError("practiceName");
            }}
          />
        </div>
      </div>
      <Footer handleNextStep={handleNextStep} handlePreviousStep={() => {}} />
    </div>
  );
};

export default PracticeName;
