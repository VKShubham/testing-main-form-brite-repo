import { MultiSelect } from "@mantine/core";
import Heading from "../common/Heading";
import { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";
import Footer from "../common/Footer";
import { ILocationDetails } from "./MultipleLocations";

const ProviderLocation = () => {
  const { formData, setStep, setFormData } = useContext(AppContext);

  const locationOptions = (
    (formData.locations as ILocationDetails[]) || []
  ).map((location) => ({
    value: location?.streetAddress,
    label: location?.streetAddress,
  }));

  useEffect(() => {
    if (formData.selectedLocations) {
      const selectedLocations = formData.selectedLocations.map(
        (selectedLocation: any) => {
          const location = formData.locations.find(
            (location: any) => location.streetAddress === selectedLocation
          );
          return location;
        }
      );
      setFormData((prevData: any) => ({
        ...prevData,
        selectedFullLocations: selectedLocations,
      }));
    }
  }, [formData.selectedLocations]);

  return (
    <div>
      <div className="my-5">
        <Heading text="Select Assigned Locations" />

        <MultiSelect
          label="Select one or multiple locations"
          placeholder="Select one or multiple locations"
          data={locationOptions}
          value={formData.selectedLocations || []}
          onChange={(selectedValues) => {
            setFormData((prevData: any) => ({
              ...prevData,
              selectedLocations: selectedValues,
            }));
          }}
        />
      </div>
      <Footer
        handleNextStep={() => setStep(13)}
        handlePreviousStep={() => setStep(11)}
      />
    </div>
  );
};

export default ProviderLocation;
