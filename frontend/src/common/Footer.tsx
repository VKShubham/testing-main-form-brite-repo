import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { totalSteps } from "../hooks/useGetComponent";
import { loadStripe } from "@stripe/stripe-js";
import { validateForm } from "../utils/validation";
import { showToast } from "./toast";

// Define props for the Footer component
interface IFooterProps {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

const Footer = ({ handleNextStep, handlePreviousStep }: IFooterProps) => {
  const [loading, setLoading] = useState(false);
  const { step, formData } = useContext(AppContext); // Get the current step from context

  // Handle visibility change to reset loading state if tab is brought back to focus
  useEffect(() => {
    setLoading(false);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setLoading(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Stripe keys from environment variables
  const testPublicKey = import.meta.env.VITE_STRIPE_KEY_PUBLIC_KEY;
  const testPriceId = import.meta.env.VITE_PRICE_ID;
  const stripePromise = loadStripe(testPublicKey);

  // Function to initiate Stripe Checkout
  const handleStripeCheckout = async () => {
    sessionStorage.setItem("isSuccess", "true");
    setLoading(true);

    const stripe = await stripePromise;

    if (!stripe) {
      alert("Stripe failed to load.");
      setLoading(false);
      return;
    }

    try {
      // Create checkout session through your backend

      if(!formData && validateForm(formData) === false) {
        showToast("Please fill out all required fields before proceeding or if you filed then reload website.", "error");
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: testPriceId,
          successUrl: window.location.origin + "/payment-success",
          cancelUrl: window.location.origin + "/cancel",
          formData: formData,
        }),
      });

      const { sessionId, success } = await response.json();

      if(!success) {
        throw new Error("Something Went Wrong, Please Reload The WebSite")
      }

      // Store session ID for later verification
      sessionStorage.setItem("stripe_session_id", sessionId);

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe error:", error);
        alert("Payment failed. Try again.");
      }
    } catch (err: any) {
      console.error("Error:", err);
      showToast(err || 'Please Reload The Website Something Went Wrong', 'error')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="rounded-b-md text-white mb-5 w-full pb-3 font-semibold flex justify-between px-5">
        {/* Previous Button (only show if not on first step) */}
        <div>
          {step !== 1 && (
            <button
              onClick={handlePreviousStep}
              className="flex items-center gap-1 cursor-pointer jiggle-left bg-[#4FB4A5] px-3 sm:px-7 rounded-xl py-3"
            >
              <FaArrowLeft className="mt-0.5 mx-1 arrow-left" />
              <div className="tracking-widest text-sm font-bold sm:text-lg">
                PREVIOUS
              </div>
            </button>
          )}
        </div>

        {/* Next or Stripe Checkout Button (skip on steps 7, 14, 16, totalSteps + 1) */}
        <div>
          {step !== totalSteps + 1 &&
            step !== 7 &&
            step !== 16 &&
            step !== 14 && (
              <button
                onClick={
                  step === totalSteps ? handleStripeCheckout : handleNextStep
                }
                disabled={loading}
                className={`flex bg-[#4FB4A5] px-3 sm:px-7 rounded-xl py-3 items-center gap-1 cursor-pointer jiggle-right ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <div className="tracking-widest text-sm font-bold sm:text-lg">
                  {loading ? "Loading..." : "NEXT"}
                </div>
                {!loading && (
                  <FaArrowRight className="mt-0.5 mx-1 arrow-right" />
                )}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Footer;
