import { JSX, useContext } from "react";
import AppContext from "../context/AppContext";
import FullName from "../components/FullName";
import ContactNumber from "../components/ContactNumber";
import EmailAddress from "../components/EmailAddress";
import SoleOwner from "../components/SoleOwner";
import AdditionalOwner from "../components/AdditionalOwner";
import MultipleLocations from "../components/MultipleLocations";
import MultipleProvider from "../components/MultipleProvider";
import OperationHubMessage from "../components/OperationHubMessage";
import AskMoreThanOneMember from "../components/AskMoreThanOneMember";
import AdditioanlMembers from "../components/AdditioanlMembers";
import CardVerification from "../components/CardVerification";
import Kits from "../components/Kits";
import PracticeName from "../components/PracticeName";
import PracticeLogo from "../components/PracticeLogo";
import FaxNumber from "../components/FaxNumber";
import PricingModal from "../components/PricingModal";
import Hormone from "../components/Hormone";
import PracticeMarkup from "../components/PracticeMarkup";
import Contract from "../components/Contract";
export const components: { [key: number]: JSX.Element } = {
  1: <PracticeName />,
  2: <PracticeLogo />,
  3: <FaxNumber />,
  4: <FullName />,
  5: <ContactNumber />,
  6: <EmailAddress />,
  7: <SoleOwner />,
  8: <AdditionalOwner />,
  9: <MultipleLocations />,
  10: <MultipleProvider />,
  11: <Kits />,
  12: <PricingModal />,
  13: <PracticeMarkup />,
  14: <Hormone />,
  15: <OperationHubMessage />,
  16: <AskMoreThanOneMember />,
  17: <AdditioanlMembers />,
  18:<Contract/>,
  19: <CardVerification />,
};

export const totalSteps = Object.keys(components).length;

const useGetComponent = () => {
  const { step } = useContext(AppContext);
  return components[step] || null;
};

export default useGetComponent;
