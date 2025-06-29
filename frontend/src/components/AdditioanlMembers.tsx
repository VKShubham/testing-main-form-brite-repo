import { useContext, useEffect, useState, useRef } from "react";
import { Button, TextInput, MultiSelect } from "@mantine/core";
import Heading from "../common/Heading";
import Footer from "../common/Footer";
import AppContext from "../context/AppContext";
import { ILocationDetails } from "./MultipleLocations";
import { showToast } from "../common/toast";

interface IMember {
  staffName: string;
  email: string;
  roles: string[];
  primaryDuties: string;
  selectedLocations: string[];
  selectedFullLocations: ILocationDetails[];
}

const AdditionalMembers = () => {
  const { setStep, formData, setFormData } = useContext(AppContext);
  const members = formData?.members || [];
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
  const lastMemberRef = useRef<HTMLDivElement | null>(null);

  const roleOptions = ["Assistant", "Finance", "Analyst"];
  const locationOptions = ((formData.locations as ILocationDetails[]) || []).map((location) => ({
    value: location?.streetAddress,
    label: location?.streetAddress,
  }));

  const addNewMember = () => {
    const newMember: IMember = {
      staffName: "",
      email: "",
      roles: [],
      primaryDuties: "",
      selectedLocations: [],
      selectedFullLocations: [],
    };
    setFormData({ ...formData, members: [...members, newMember] });

    setTimeout(() => {
      lastMemberRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_:any, i:any) => i !== index);
    setFormData({ ...formData, members: updatedMembers });
    const updatedErrors = { ...errors };
    delete updatedErrors[index];
    setErrors(updatedErrors);
  };

  const handleMemberChange = (index: number, field: string, value: any) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };

    if (field === "selectedLocations") {
      updatedMembers[index].selectedFullLocations = value.map(
        (selectedLocation: string) =>
          formData.locations.find((location: any) => location.streetAddress === selectedLocation)
      );
    }

    setFormData({ ...formData, members: updatedMembers });
  };

  const handleMultiSelectChange = (
    index: number,
    field: "roles" | "selectedLocations",
    selected: string[],
    allOptions: string[]
  ) => {
    const isSelectAllClicked = selected.includes("all");

    if (isSelectAllClicked) {
      const allValues = [...allOptions];
      const current = members[index][field];
      const allSelected = allValues.every((opt) => current.includes(opt));
      const newValue = allSelected ? [] : allValues;
      handleMemberChange(index, field, newValue);
    } else {
      const filtered = selected.filter((val) => val !== "all");
      handleMemberChange(index, field, filtered);
    }
  };

  const renderMultiSelectValue = (selected: string[]): string[] => {
    return selected;
  };

  const handleNextStep = () => {
    const newErrors: Record<number, Record<string, string>> = {};
    let firstErrorShown = false;

    members.forEach((member:any, index:any) => {
      const memberErrors: Record<string, string> = {};

      if (!member.staffName.trim()) {
        memberErrors.staffName = "Full name is required.";
        if (!firstErrorShown) {
          showToast(`Enter the team member's name for Team Member ${index + 1}`, "error");
          firstErrorShown = true;
        }
      } else if (member.staffName.length < 3) {
        memberErrors.staffName = "Full name must be at least 3 letters long.";
        if (!firstErrorShown) {
          showToast(`Full name must be at least 3 letters long for Team Member ${index + 1}`, "error");
          firstErrorShown = true;
        }
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?!co$)[a-zA-Z]{2,}$/;

      if (!member.email.trim()) {
        memberErrors.email = "Email address is required.";
        if (!firstErrorShown) {
          showToast(`Enter the team member's email for Team Member ${index + 1}`, "error");
          firstErrorShown = true;
        }
      } else if (!emailRegex.test(member.email)) {
        memberErrors.email = "Enter a valid email address.";
        if (!firstErrorShown) {
          showToast(`Enter a valid email address for Team Member ${index + 1}`, "error");
          firstErrorShown = true;
        }
      } else if (formData.email === member.email) {
        memberErrors.email = "You have already used this email for practice email. Please enter a unique email for team member.";
        showToast(`Duplicate practice email for Team Member ${index + 1}`, "error");
        firstErrorShown = true;
      } else if (formData?.owners?.map((ele: any) => ele.email).includes(member.email)) {
        memberErrors.email = "This email is already used by an owner. Please enter a unique email.";
        showToast(`Duplicate owner email for Team Member ${index + 1}`, "error");
        firstErrorShown = true;
      } else if (formData?.providers?.map((ele: any) => ele.email).includes(member.email)) {
        memberErrors.email = "This email is already used by a provider. Please enter a unique email.";
        showToast(`Duplicate provider email for Team Member ${index + 1}`, "error");
        firstErrorShown = true;
      } else if (members.some((p:any, i:any) => i !== index && p.email === member.email)) {
        memberErrors.email = "Duplicate email found. Please enter a unique email.";
        showToast(`Duplicate email for another team member (Team Member ${index + 1})`, "error");
        firstErrorShown = true;
      }

      if (!member.roles.length) {
        memberErrors.roles = "Select the permissions in the hub.";
        if (!firstErrorShown) {
          showToast(`Select permissions for Team Member ${index + 1}`, "error");
          firstErrorShown = true;
        }
      }

      if (!member.primaryDuties.trim()) {
        memberErrors.primaryDuties = "Enter the primary duties.";
        if (!firstErrorShown) {
          showToast(`Enter primary duties for Team Member ${index + 1}`, "error");
          firstErrorShown = true;
        }
      }

      if (!member.selectedLocations?.length) {
        memberErrors.selectedLocations = "Select the location(s)";
        if (!firstErrorShown) {
          showToast(`Select locations for Team Member ${index + 1}`, "error");
          firstErrorShown = true;
        }
      }

      if (Object.keys(memberErrors).length) newErrors[index] = memberErrors;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(18);
    }
  };

  useEffect(() => {
    if (members.length === 0) addNewMember();
  }, []);

  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="Operation Hub: Team Member Access" />
        <div className="text-white text-base max-[450px]:text-sm text-center pb-3">
          Since you selected 'I have team members', enter the details of your team members who will need access to the Operations Hub. Click '+ Add More Member(s)' to include additional team members as needed.

          <p className="text-red-600 mt-5">Note: Do not re-enter practice owners here—owner access has already been granted automatically.</p>
        </div>
        <div className="max-h-[calc(100vh-450px)] overflow-auto pr-3">
          {members.map((member :any, index:any) => (
            <div
              key={index}
              className="p-3 rounded-md my-5 container-card"
              ref={index === members.length - 1 ? lastMemberRef : null}
            >
              <div className="grid max-[450px]:grid-cols-1 max-[600px]:grid-cols-2 grid-cols-3 gap-5">
                <TextInput
                  label="Team Member's Name"
                  value={member.staffName}
                  placeholder="e.g., John Doe"
                  error={errors[index]?.staffName}
                  onChange={(e) => handleMemberChange(index, "staffName", e.target.value)}
                />
                <TextInput
                  label="Team Member's Email"
                  value={member.email}
                  error={errors[index]?.email}
                  placeholder="e.g., johndoe@ohwi.com"
                  onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                />
                <TextInput
                  label="Team Member's Primary Duties"
                  value={member.primaryDuties}
                  error={errors[index]?.primaryDuties}
                  placeholder="e.g., Assisting Patients, etc."
                  onChange={(e) => handleMemberChange(index, "primaryDuties", e.target.value)}
                />
              </div>
              <div className="grid max-[450px]:grid-cols-1 grid-cols-2 gap-5 mt-5">
                <MultiSelect
                  label="Permissions in HUB (Select One or More)"
                  data={[{ value: "all", label: "Select All Roles" }, ...roleOptions.map((r) => ({ value: r, label: r }))]}
                  value={renderMultiSelectValue(member.roles)}
                  placeholder="Click to select the permission(s)"
                  error={errors[index]?.roles}
                  onChange={(selected) =>
                    handleMultiSelectChange(index, "roles", selected, roleOptions)
                  }
                  searchable
                  clearable
                />

                <MultiSelect
                  label="Location(s)"
                  data={[{ value: "all", label: "Select All Locations" }, ...locationOptions]}
                  value={renderMultiSelectValue(member.selectedLocations)}
                  error={errors[index]?.selectedLocations}
                  placeholder="Click to select the location(s)"
                  onChange={(selected) =>
                    handleMultiSelectChange(index, "selectedLocations", selected, locationOptions.map((loc) => loc.value))
                  }
                  searchable
                  clearable
                />
              </div>
              {members.length > 1 && (
                <div className="flex justify-end w-full">
                  <Button
                    variant="outline"
                    color="red"
                    size="xs"
                    className="mt-3 !bg-red-500 !text-white"
                    onClick={() => removeMember(index)}
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
          onClick={addNewMember}
        >
          + Add More Member(s)
        </Button>
      </div>
      <Footer handleNextStep={handleNextStep} handlePreviousStep={() => setStep(16)} />
    </div>
  );
};

export default AdditionalMembers;
