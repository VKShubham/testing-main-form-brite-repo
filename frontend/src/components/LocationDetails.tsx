import { useContext } from "react";
import useInputChange from "../hooks/useInputChange";
import AppContext from "../context/AppContext";
import Heading from "../common/Heading";
import { Select, TextInput } from "@mantine/core";
import Footer from "../common/Footer";

const LocationDetails = () => {
  const handleInputChange = useInputChange();
  const { formData, setStep } = useContext(AppContext);

  return (
    <div>
      <Heading text="Location Details" />
      <div className="text-gray-500 text-base text-center pb-3">
        Enter the full location details, including name, identifier, and address
      </div>
      <div className="my-5">
        <div className="grid grid-cols-2 gap-x-5">
          <TextInput
            label="Location Name"
            value={formData?.locationName}
            placeholder="Location Name"
            onChange={(e) => {
              handleInputChange("locationName", e.target.value);
            }}
          />
          <TextInput
            label="Location Identifier"
            value={formData?.locationIdentifier}
            placeholder="Location Identifier"
            onChange={(e) => {
              handleInputChange("locationIdentifier", e.target.value);
            }}
          />
        </div>
        <TextInput
          label="Street Address"
          value={formData?.streetAddress}
          placeholder="Street Address"
          onChange={(e) => {
            handleInputChange("streetAddress", e.target.value);
          }}
        />
        <TextInput
          label="Street Address Line 2"
          value={formData?.streetAddressLine2}
          placeholder="Street Address Line 2"
          onChange={(e) => {
            handleInputChange("streetAddressLine2", e.target.value);
          }}
        />
        <div className="grid grid-cols-2 gap-x-5">
          <TextInput
            label="City"
            value={formData?.city}
            placeholder="City"
            onChange={(e) => {
              handleInputChange("city", e.target.value);
            }}
          />
          <Select
            label="State"
            placeholder="State"
            value={formData?.state}
            onChange={(e) => {
              handleInputChange("state", e);
            }}
            data={[
              "Gujarat",
              "Maharashtra",
              "Rajasthan",
              "Madhya Pradesh",
              "Uttar Pradesh",
              "Tamil Nadu",
            ]}
          />
        </div>
        <TextInput
          label="Zip Code"
          value={formData?.zipCode}
          placeholder="Zip Code"
          onChange={(e) => {
            handleInputChange("zipCode", e.target.value);
          }}
        />
      </div>

      <Footer
        handleNextStep={() => {
          setStep(8);
        }}
        handlePreviousStep={() => {
          if (formData?.isSoleOwner) {
            setStep(4);
          } else {
            setStep(6);
          }
        }}
      />
    </div>
  );
};

export default LocationDetails;
