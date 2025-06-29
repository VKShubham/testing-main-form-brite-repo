import { createContext } from "react";

interface AppContextType {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export default AppContext;
