import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/AppContext";
import Heading from "../common/Heading";
import { Button, TextInput } from "@mantine/core";
import Footer from "../common/Footer";
import { showToast } from "../common/toast";

interface IOwnerDetails {
  fullName: string;
  email: string;
  phone: string;
}

const AdditionalOwner = () => {
  const { formData, setFormData, setStep } = useContext(AppContext);
  const owners = formData?.owners || [];
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>(
    {}
  );
  const ownerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addNewOwner = () => {
    const newOwner: IOwnerDetails = { fullName: "", email: "", phone: "" };
    setFormData({ ...formData, owners: [...owners, newOwner] });

    setTimeout(() => {
      const lastIndex = owners.length;
      ownerRefs.current[lastIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const removeOwner = (index: number) => {
    const updatedOwners = (owners as IOwnerDetails[]).filter(
      (_owner, i) => i !== index
    );
    setFormData({ ...formData, owners: updatedOwners });

    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
  };

  const handleOwnerChange = (
    index: number,
    field: keyof IOwnerDetails,
    value: string
  ) => {
    if (field === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10); // Remove non-digits, limit to 10 digits
      if (value.length >= 7) {
        value = `(${value.slice(0, 3)})-${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length >= 4) {
        value = `(${value.slice(0, 3)})-${value.slice(3)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
    }

    const updatedOwners = [...owners];
    updatedOwners[index] = { ...updatedOwners[index], [field]: value };
    setFormData({ ...formData, owners: updatedOwners });
    validateField(index, field, value);
  };

  const validateField = (
    index: number,
    field: keyof IOwnerDetails,
    value: string
  ) => {
    let error = "";

    if (!value.trim()) {
      error =
        field === "fullName"
          ? "Full name is required."
          : field === "email"
          ? "Email address is required."
          : "Phone number is required.";
    } else if (
      field === "email" &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?!co$)[a-zA-Z]{2,}$/.test(value)
    ) {
      error = "Enter a valid email address.";
    } else if (field === "phone") {
      const cleanedPhone = value.replace(/\D/g, "");
      if (cleanedPhone.length !== 10) {
        error = "Phone number must be 10 digits.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [index]: { ...prevErrors[index], [field]: error },
    }));
  };

  const handleNext = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let firstErrorShown = false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?!co$)[a-zA-Z]{2,}$/;

    // Validate individual owner fields
    (owners as IOwnerDetails[]).forEach((owner, index) => {
      const ownerErrors: Record<string, string> = {};

      // Validate full name
      if (!owner.fullName?.trim()) {
        ownerErrors.fullName = "Full name is required.";
        if (!firstErrorShown) {
          showToast(`Enter the full name for Owner ${index + 1}`, "error");
          firstErrorShown = true;
        }
      } else if (owner.fullName.trim().length < 3) {
        ownerErrors.fullName = "Full name must be at least 3 characters long.";
        if (!firstErrorShown) {
          showToast(`Full name must be at least 3 characters long for Owner ${index + 1}`, "error");
          firstErrorShown = true;
        }
      }

      // Validate email
      if (!owner.email?.trim()) {
        ownerErrors.email = "Email address is required.";
        if (!firstErrorShown) {
          showToast(`Enter the email address for Owner ${index + 1}`, "error");
          firstErrorShown = true;
        }
      } else if (formData?.email === owner.email) {
        ownerErrors.email = "This email address was already entered on a previous page. Please enter a different email address.";
        if (!firstErrorShown) {
          showToast(`This email address was already entered on a previous page. Please enter a different email address for Owner ${index + 1}`, "error");
          firstErrorShown = true;
        }
      } else if (
        (owners as IOwnerDetails[]).some((o, i) => i < index && o.email === owner.email)
      ) {
        ownerErrors.email = "You have already used this email for another owner. Please enter a unique email.";
        if (!firstErrorShown) {
          showToast(`You have already used this email for another owner. Please enter a unique email for Owner ${index + 1}`, "error");
          firstErrorShown = true;
        }
      } else if (!emailRegex.test(owner.email)) {
        ownerErrors.email = "Enter a valid email address.";
        if (!firstErrorShown) {
          showToast(`Enter a valid email address for Owner ${index + 1}`, "error");
          firstErrorShown = true;
        }
      }

      // Validate phone number
      if (!owner.phone?.trim()) {
        ownerErrors.phone = "Phone number is required.";
        if (!firstErrorShown) {
          showToast(`Enter the phone number for Owner ${index + 1}`, "error");
          firstErrorShown = true;
        }
      } else {
        const cleanedPhone = owner.phone.replace(/\D/g, "");
        if (cleanedPhone.length !== 10) {
          ownerErrors.phone = "Phone number must be 10 digits.";
          if (!firstErrorShown) {
            showToast(`Phone number must be 10 digits for Owner ${index + 1}`, "error");
            firstErrorShown = true;
          }
        }
      }

      // Add errors for this owner
      if (Object.keys(ownerErrors).length) {
        newErrors[index] = ownerErrors;
      }
    });

    // Check for duplicate owner names
    const nameMap = new Map<string, number[]>();
    (owners as IOwnerDetails[]).forEach((owner, index) => {
      const name = owner.fullName?.trim();
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
            fullName: "Duplicate owner name is not allowed.",
          };
        });
        if (!firstErrorShown) {
          showToast(`Duplicate owner name '${name}' is not allowed.`, "error");
          firstErrorShown = true;
        }
      }
    });

    // Check for duplicate phone numbers
    const phoneMap = new Map<string, number[]>();
    (owners as IOwnerDetails[]).forEach((owner, index) => {
      const phone = owner.phone?.replace(/\D/g, "");
      if (phone && phone.length === 10) {
        if (!phoneMap.has(phone)) {
          phoneMap.set(phone, []);
        }
        phoneMap.get(phone)?.push(index);
      }
    });

    phoneMap.forEach((indices, _phone) => {
      if (indices.length > 1) {
        indices.forEach((index) => {
          newErrors[index] = {
            ...newErrors[index],
            phone: "Duplicate phone number is not allowed.",
          };
        });
        if (!firstErrorShown) {
          showToast(`Duplicate phone number is not allowed.`, "error");
          firstErrorShown = true;
        }
      }
    });

    // Update error state
    setErrors(newErrors);

    // Prevent next step if there are any errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Move to the next step
    setStep(9);
  };

  useEffect(() => {
    if (owners.length === 0) {
      addNewOwner();
    }
  }, []);

  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="Additional Practice Owner(s) Information" />
        <div className="text-white text-base max-[450px]:text-sm text-center pb-3">
          Since you selected 'More Than One Owner,' please enter the second
          owner's details below. If there are additional owners, click '+ Add
          More Practice Owner(s)' to include them.
        </div>
        <div className="max-h-[calc(100vh-450px)] overflow-auto pr-3">
          {(owners as IOwnerDetails[]).map((owner, index) => (
            <div
              key={index}
              ref={(el) => {
                ownerRefs.current[index] = el;
              }}
              className="my-3"
            >
              <div className="grid container-card sm:grid-cols-[1fr_1fr_1fr_50px] items-center gap-x-2 w-full">
                {Object.keys(owner).map((key) => {
                  const field = key as keyof IOwnerDetails;
                  return (
                    <div key={field} className="w-full ">
                      <TextInput
                        label={field
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        value={owner[field]}
                        className="w-full"
                        placeholder={
                          field === "fullName"
                            ? "e.g., Ben N. Cloth"
                            : field === "email"
                            ? "e.g., owner@ohwi.com"
                            : field === "phone"
                            ? "(XXX)-XXX-XXXX"
                            : ""
                        }
                        onChange={(e) =>
                          handleOwnerChange(index, field, e.target.value)
                        }
                        error={errors[index]?.[field]}
                      />
                    </div>
                  );
                })}
                {owners.length > 1 && (
                  <div className="flex justify-end w-full">
                    <Button
                      variant="outline"
                      color="red"
                      size="xs"
                      className="mt-8 !bg-red-500 !text-white"
                      onClick={() => removeOwner(index)}
                    >
                      <span className="sm:hidden">Remove</span>
                      <span className="hidden sm:inline bg-red-500 text-white">
                        X
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button
          className="sm:!px-10 !text-lg !h-[52px] !mb-5 mt-5 add-button"
          onClick={addNewOwner}
        >
          + Add More Practice Owner(s)
        </Button>
      </div>
      <Footer
        handleNextStep={handleNext}
        handlePreviousStep={() => setStep(7)}
      />
    </div>
  );
};

export default AdditionalOwner;
