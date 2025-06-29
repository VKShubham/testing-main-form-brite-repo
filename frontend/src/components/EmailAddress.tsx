import { useContext } from "react";
import useInputChange from "../hooks/useInputChange";
import AppContext from "../context/AppContext";
import Heading from "../common/Heading";
import { TextInput } from "@mantine/core";
import Footer from "../common/Footer";
import useValidation from "../hooks/useValidation";

const EmailAddress = () => {
  const handleInputChange = useInputChange();
  const { formData, setStep } = useContext(AppContext);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?!co$)[a-zA-Z]{2,}$/;

  // Validation rules
  const validationRules = {
    email: {
      required: true,
      message: "Email address is required.",
      pattern: {
        value: emailRegex,
        message: "Enter a valid email address.",
      },
    },
  };

  const { errors, validateFields, clearError, setError } =
    useValidation(validationRules);

  const handleNextStep = () => {
    if (!formData?.email) {
      setError("email", "Email address is required.");
      return;
    }

    // Validate email format using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("email", "Enter a valid email address.");
      return;
    }

    // Proceed if validation passes
    if (validateFields(formData)) {
      setStep(7);
    }
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10">
        <Heading text="Practice Owner's Email" />
        <div className="mb-5">
          <TextInput
            type="email"
            value={formData?.email}
            error={errors?.email}
            placeholder="e.g., owner@ohwi.com"
            onChange={(e) => {
              handleInputChange("email", e.target.value);
              clearError("email");
            }}
          />
        </div>
      </div>
      <Footer
        handleNextStep={handleNextStep}
        handlePreviousStep={() => {
          setStep(5);
        }}
      />
    </div>
  );
};

export default EmailAddress;
