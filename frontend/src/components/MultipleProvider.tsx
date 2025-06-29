import { useContext, useEffect, useState, useRef } from "react";
import { Button, TextInput, MultiSelect, Tooltip } from "@mantine/core";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import { ILocationDetails } from "./MultipleLocations";
import { showToast } from "../common/toast";

export interface IProvider {
  providerFullName: string;
  email: string;
  selectedLocations: string[];
  selectedFullLocations: ILocationDetails[];
}

const MultipleProvider = () => {
  const { setStep, formData, setFormData } = useContext(AppContext);
  const providers = formData?.providers || [];
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );
  const providerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const actualLocationOptions = (
    (formData.locations as ILocationDetails[]) || []
  ).map((location) => ({
    value: location?.streetAddress,
    label: location?.streetAddress,
  }));

  const locationOptions = [
    { value: "__select_all__", label: "Select All Locations" },
    ...actualLocationOptions,
  ];

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?!co$)[a-zA-Z]{2,}$/;

  const addNewProvider = () => {
    const newProvider = {
      providerFullName: "",
      email: "",
      selectedLocations: [],
      selectedFullLocations: [],
    };

    setFormData({ ...formData, providers: [...providers, newProvider] });

    setTimeout(() => {
      const lastIndex = providers.length;
      providerRefs.current[lastIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const removeProvider = (index: number) => {
    const updatedProviders = (providers as IProvider[]).filter(
      (_, i) => i !== index
    );

    // Update formData with the updated providers array
    // Also update kits array to remove entries with the removed provider
    const removedProvider = providers[index];
    let updatedKits = formData.kits || [];

    if (removedProvider && removedProvider.providerFullName) {
      updatedKits = updatedKits.filter(
        (kit: any) => kit.shippingProvider !== removedProvider.providerFullName
      );
    }

    setFormData({
      ...formData,
      providers: updatedProviders,
      kits: updatedKits
    });

    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
  };

  console.log("providers Locations", providers.selectedLocations)

  const handleProviderChange = (index: number, field: string, value: any) => {
    const updatedProviders = [...providers];

    // Handle "Select All" functionality
    if (field === "selectedLocations") {
      if (value.includes("__select_all__")) {
        // If "Select All Locations" is selected, set all locations
        updatedProviders[index].selectedLocations = actualLocationOptions.map(
          (location) => location.value
        );
        updatedProviders[index].selectedFullLocations = formData.locations;
      } else {
        // If "Select All Locations" is not selected, filter out it
        updatedProviders[index].selectedLocations = value.filter(
          (location: string) => location !== "__select_all__"
        );
        updatedProviders[index].selectedFullLocations = value.map(
          (selectedLocation: string) => {
            return formData.locations.find(
              (location: any) => location.locationIdentifier === selectedLocation
            );
          }
        );
      }
    } else {
      updatedProviders[index] = { ...updatedProviders[index], [field]: value };

      // If provider name changes, update any kit entries with the old name
      if (field === "providerFullName" && formData.kits) {
        const oldName = providers[index]?.providerFullName;
        if (oldName && oldName !== value) {
          const updatedKits = (formData.kits || []).map((kit: any) => {
            if (kit.shippingProvider === oldName) {
              return { ...kit, shippingProvider: value };
            }
            return kit;
          });

          setFormData({
            ...formData,
            providers: updatedProviders,
            kits: updatedKits
          });
          return; // Skip the setFormData below since we already did it
        }
      }
    }

    setFormData({ ...formData, providers: updatedProviders });

    if (errors[index] && errors[index][field]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[index][field];
        if (Object.keys(updatedErrors[index]).length === 0) {
          delete updatedErrors[index];
        }
        return updatedErrors;
      });
    }
  };

  useEffect(() => {
    if (providers.length === 0) {
      addNewProvider();
    }
  }, []);

  const handleNextStep = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let firstErrorShown = false;

    (providers as IProvider[]).forEach((provider, index) => {
      const providerErrors: Record<string, string> = {};

      if (!provider.providerFullName?.trim()) {
        providerErrors.providerFullName = "Full name is required.";
        if (!firstErrorShown) {
          showToast(`Enter the full name for Provider ${index + 1}`, "error");
          firstErrorShown = true;
        }
      }

      if (
        provider.providerFullName?.trim() &&
        provider.providerFullName?.trim().length < 3
      ) {
        providerErrors.providerFullName =
          "Full name should be at least 3 characters long.";
        if (!firstErrorShown) {
          showToast(
            `Full name should be at least 3 characters long for Provider ${index + 1
            }`,
            "error"
          );
          firstErrorShown = true;
        }
      }

      if (!provider.email?.trim()) {
        providerErrors.email = "Email address is required.";
        if (!firstErrorShown) {
          showToast(
            `Enter the email address for Provider ${index + 1}`,
            "error"
          );
          firstErrorShown = true;
        }
      } else if (formData.email === provider.email) {
        providerErrors.email =
          "This email address was already entered on a previous page. Please enter a different email address.";
        showToast(
          `you have already used this email for practice email, please enter a unique email for provider ${index + 1
          }`,
          "error"
        );
        firstErrorShown = true;
      } else if (
        formData?.owners?.map((ele: any) => ele.email).includes(provider.email)
      ) {
        providerErrors.email =
          "you have already used this email for owner email, please enter a unique email.";
        showToast(
          `you have already used this email for owner email, please enter a unique email for provider ${index + 1
          }`,
          "error"
        );
        firstErrorShown = true;
      } else if (
        (providers as IProvider[]).some((p, i) => i < index && p.email === provider.email)
      ) {
        providerErrors.email =
          "You have already used this email for another provider. Please enter a unique email.";
        showToast(
          `You have already used this email for another provider. Please enter a unique email for Provider ${index + 1
          }`,
          "error"
        );
        firstErrorShown = true;
      } else if (!emailRegex.test(provider.email)) {
        providerErrors.email = "Enter a valid email address.";
        if (!firstErrorShown) {
          showToast(
            `Enter a valid email address for Provider ${index + 1}`,
            "error"
          );
          firstErrorShown = true;
        }
      }

      if (!provider.selectedLocations.length) {
        providerErrors.selectedLocations = "Select at least one location.";
        if (!firstErrorShown) {
          showToast(
            `Select the location(s) for Provider ${index + 1}`,
            "error"
          );
          firstErrorShown = true;
        }
      }

      if (Object.keys(providerErrors).length) {
        newErrors[index] = providerErrors;
      }
    });

    const nameMap = new Map<string, number[]>();
    (providers as IProvider[]).forEach((provider, index) => {
      const name = provider.providerFullName?.trim();
      if (name) {
        if (!nameMap.has(name)) {
          nameMap.set(name, []);
        }
        nameMap.get(name)?.push(index);
      }
    });

    nameMap.forEach((indices, name) => {
      if (indices.length > 1) {
        indices.forEach((index) => {
          newErrors[index] = {
            ...newErrors[index],
            providerFullName: "Duplicate provider name is not allowed.",
          };
        });
        if (!firstErrorShown) {
          showToast(
            `Duplicate provider name '${name}' is not allowed.`,
            "error"
          );
          firstErrorShown = true;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Sync kits with current providers before moving to next step
    const currentProviderNames = providers.map((p: any) => p.providerFullName);
    let updatedKits = formData.kits || [];

    // Remove kits for providers that no longer exist
    updatedKits = updatedKits.filter((kit: any) =>
      kit.shippingProvider === "" || currentProviderNames.includes(kit.shippingProvider)
    );

    // Ensure each provider has a kit entry
    const existingKitProviders = updatedKits.map((kit: any) => kit.shippingProvider);
    const providersWithoutKits = currentProviderNames.filter(
      (name: any) => name && !existingKitProviders.includes(name)
    );

    // Add kit entries for new providers
    const newKitEntries = providersWithoutKits.map((name: any) => ({
      shippingProvider: name,
      shippingLocation: ""
    }));

    if (newKitEntries.length > 0) {
      updatedKits = [...updatedKits, ...newKitEntries];
    }

    setFormData({
      ...formData,
      kits: updatedKits
    });

    setStep(11);
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="Provider(s) Information" />
        <div className="text-white text-base max-[450px]:text-sm text-center pb-3">
          Enter the details of the provider(s) working at your practice. If you
          have more than one provider, click '+ Add More Provider(s)' to include
          additional entries. If you or any practice owner is also a provider,
          please fill out this section for yourself/them as well.
        </div>

        <div className="max-h-[calc(100vh-500px)] overflow-auto pr-3">
          {providers.map((provider: any, index: number) => (
            <div
              key={index}
              ref={(el) => {
                providerRefs.current[index] = el;
              }}
              className="p-3 rounded-md my-5 container-card"
            >
              <div className="grid grid-cols-3 max-[450px]:grid-cols-1 max-[600px]:grid-cols-2 gap-x-5">
                <TextInput
                  label="Full Name"
                  value={provider.providerFullName}
                  error={errors[index]?.providerFullName}
                  placeholder="e.g., Ben N. Cloth"
                  onChange={(e) =>
                    handleProviderChange(
                      index,
                      "providerFullName",
                      e.target.value
                    )
                  }
                />
                <div>
                  <div className="flex items-center mt-1">
                    <Tooltip
                      label={
                        <div
                          style={{ maxWidth: "400px", whiteSpace: "normal" }}
                        >
                          Use a different email address than the one entered
                          earlier for the owner. The owner's email is used to
                          invite them to the Operations Hub (the portal for
                          practice and team), which is separate from the
                          Provider Portal.
                        </div>
                      }
                      withArrow
                    >
                      <span className="text-sm font-medium cursor-help">
                        Email Address
                      </span>
                    </Tooltip>
                  </div>
                  <TextInput
                    value={provider.email}
                    error={errors[index]?.email}
                    placeholder="e.g., provider@gmail.com"
                    onChange={(e) =>
                      handleProviderChange(index, "email", e.target.value)
                    }
                  />
                </div>
                <MultiSelect
                  label="Location(s)"
                  data={locationOptions}
                  value={provider.selectedLocations}
                  error={errors[index]?.selectedLocations}
                  placeholder={
                    provider?.selectedLocations?.length
                      ? ""
                      : "Click to select the location(s)"
                  }
                  onChange={(selectedValues) =>
                    handleProviderChange(
                      index,
                      "selectedLocations",
                      selectedValues
                    )
                  }
                />
              </div>

              {providers.length > 1 && (
                <div className="flex justify-end w-full">
                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    className="mt-3 !bg-red-500 !text-white"
                    onClick={() => removeProvider(index)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          className="!px-10 add-button !text-lg !h-[52px] !mb-5 max-[450px]:!px-5 mt-5 max-[450px]:!text-sm max-[450px]:!h-[40px]"
          onClick={addNewProvider}
        >
          + Add More Provider(s)
        </Button>
      </div>
      <Footer
        handleNextStep={handleNextStep}
        handlePreviousStep={() => setStep(9)}
      />
    </div>
  );
};

export default MultipleProvider;