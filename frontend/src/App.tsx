import { Navigate, Route, Routes } from "react-router";
import Form from "./pages/Form";
import { useState, useEffect } from "react";
import AppContext from "./context/AppContext";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentSuccess from "./pages/PaymentSuccess";
import Success from "./pages/Success";

const App = () => {
  const [step, setStep] = useState(() => {
    return Number(sessionStorage.getItem("step")) || 1;
  });

  const [formData, setFormData] = useState(() => {
    const savedFormData = sessionStorage.getItem("formData");
    return savedFormData ? JSON.parse(savedFormData) : {};
  });

  console.log(formData, "===formData===");
  useEffect(() => {
    sessionStorage.setItem("step", String(step));
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  return (
    <AppContext.Provider value={{ step, setStep, formData, setFormData }}>
      <Routes>
        <Route path="/brite-pracice-onboarding" element={<Form />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<Navigate to="/brite-pracice-onboarding" />} />
      </Routes>
      <ToastContainer
        className="custom-toast-container"
        toastStyle={{
          padding: "20px",
        }}
        position="top-center"
        transition={Bounce}
        limit={3}
      />
    </AppContext.Provider>
  );
};

export default App;
