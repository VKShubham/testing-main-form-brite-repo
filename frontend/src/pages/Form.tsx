import { useContext } from "react";
import useGetComponent, {
  components,
  totalSteps,
} from "../hooks/useGetComponent";
import { Stepper, Step } from "react-form-stepper"; // Import Step component
import AppContext from "../context/AppContext";

const Form = () => {
  const component = useGetComponent();
  const { step, setStep, formData } = useContext(AppContext); // Get step and setStep

  return (
    <div className="root">
      {/* <img
        src="./logo.png"
        className="w-[100px] h-[100px] absolute top-10 left-10"
        alt="Mantine logo"
      /> */}
      <div className="relative z-10">{component}</div>

      {/* Stepper Component */}
      <div className="absolute max-[550px]:hidden bottom-2 w-screen max-w-[1150px] flex justify-center">
        <Stepper
          activeStep={step - 1} // Convert step to 0-based index
          className="absolute bottom-6 w-screen max-w-[1150px] flex justify-center"
          styleConfig={{
            activeBgColor: "#666666", // Green for active step
            fontWeight: "bold",
            completedBgColor: "#45bda6", // Green for completed steps
            inactiveBgColor: "#666666", // Blue for incomplete steps
            activeTextColor: "white",
            completedTextColor: "white",
            inactiveTextColor: "white",
            labelFontSize: 0, // Hide step labels
            size: 20, // Default step size
            activeSize: 24, // Make active step bigger
            circleFontSize: 0, // Hide numbers inside steps
            borderRadius: "50%", // Make steps circular
            borderWidth: 2, // Add white border
            borderColor: "white",
          }}
          connectorStyleConfig={{
            activeColor: "#4CAF50", // Green for completed steps
            completedColor: "#4CAF50",
            disabledColor: "#007BFF", // Blue for incomplete steps
            size: 2, // Adjust connector thickness
            style: "solid",
          }}
        >
          {Object.keys(components).map((_, index) => (
            <Step
              key={index}
              className="p-2 h-2"
              onClick={() => {
                if (formData.isSoleOwner && index === 4) {
                  return setStep(4);
                }
                setStep(index + 1);
              }}
            ></Step>
          ))}
        </Stepper>
      </div>

      {/* Step Progress Text */}
      <div className="text-center fixed bottom-1 bg-black/20 text-white mt-2 px-5 py-1.5 rounded-md text-sm font-semibold">
        {step} of {totalSteps}
      </div>
    </div>
  );
};

export default Form;
