import { useContext, useState } from "react";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import { showToast } from "../common/toast";

const PricingModal = () => {
  const { setStep } = useContext(AppContext);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="container-home bg-main">
      <div className="px-10 max-[450px]:px-3">
        <Heading text="BRITE Pricing Model" />
        <div>
          <div className="max-h-[calc(100vh-370px)] overflow-auto pr-3 mb-5">
            <div className="p-3 rounded container-card my-5 space-y-5">
              <div className="bg-[#e5e7ea] p-5 space-y-2 max-w-[900px] mx-auto">
                <div className="text-lg sm:text-xl font-bold">
                  Hormone Subscription Pricing
                </div>
                <div>
                  BRITE operates on a <strong>subscription-based model</strong>{" "}
                  for hormone therapy. Your practice is charged a monthly or
                  annual subscription, based on the number of hormones
                  prescribed to patients — not per order.
                </div>
                <div>
                  Please refer to the BRITE Hormone Pricing Chart below for
                  details.
                </div>
              </div>
              <div className="bg-[#e5e7ea] p-5 space-y-5 max-w-[550px] mx-auto">
                <div className="text-xl sm:text-2xl font-bold text-center">
                  Pricing for BRITE Subscription for Women (Any Hormone
                  Combination)
                </div>
                <div className="grid grid-cols-3 justify-center text-center">
                  <div>
                    <div className="font-bold sm:text-lg">Count</div>
                    <div>1 hormone</div>
                    <div>2 hormones</div>
                    <div>3 hormones</div>
                    <div>4 hormones</div>
                  </div>
                  <div>
                    <div className="font-bold sm:text-lg">Monthly</div>
                    <div>$46</div>
                    <div>$74</div>
                    <div>$111</div>
                    <div>$124</div>
                  </div>
                  <div>
                    <div className="font-bold sm:text-lg">Annual (10% off)</div>
                    <div>$496.80</div>
                    <div>$799.20</div>
                    <div>$1198.80</div>
                    <div>$1339.20</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#e5e7ea] p-5 space-y-5 max-w-[550px] mx-auto">
                <div className="text-xl sm:text-2xl font-bold text-center">
                  Pricing for BRITE Subscription for Men
                </div>
                <div className="text-sm">
                  The subscription pricing for men includes PDE5 inhibitors
                  (Tadalafil/Sildenafil) when prescribed alongside
                  testosterone—so there’s no additional charge. However, if the
                  male patient is not on a hormone subscription and you
                  prescribe only a PDE5 inhibitor, it will be billed separately
                  as an individual medication.
                </div>
                <div className="grid grid-cols-3 justify-center text-center">
                  <div>
                    <div className="font-bold sm:text-lg">Hormone</div>
                    <div className="pt-2">Testosterone</div>
                  </div>
                  <div>
                    <div className="font-bold sm:text-lg">Monthly</div>
                    <div className="pt-2">$83</div>
                  </div>
                  <div>
                    <div className="font-bold sm:text-lg">Annual (10% off)</div>
                    <div className="pt-2">$896.40</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#e5e7ea] p-5 space-y-2 max-w-[900px] mx-auto">
                <div className="sm:text-xl text-lg font-bold">
                  Non-Hormone Medications: Pay-Per-Order
                </div>
                <div>
                  If you include any <strong>non-hormone medications</strong>{" "}
                  (like <strong>Sildenafil, Tadalafil, HCG,</strong> etc.) in an
                  order, the next page will ask whether you want to{" "}
                  <strong>include the cost of other medications</strong>{" "}
                  yourself or <strong>let your patients choose</strong> to pay
                  for them. You’ll always be able to change this configuration
                  later if needed.
                </div>
              </div>

              <div className="bg-[#e5e7ea] p-5 space-y-2 max-w-[900px] mx-auto">
                <div className="sm:text-xl text-lg font-bold">
                  Shipping Rates
                </div>
                <div>
                  <div>
                    <strong>USPS Priority (3-5 day delivery): </strong>
                    <span>$14.95</span>
                  </div>
                  <div>
                    <strong>UPS 2nd Day Air (2-day delivery): </strong>
                    <span>$19.95</span>
                  </div>
                  <div className="py-2">
                    On the next page, you’ll choose who pays for{" "}
                    <strong>shipping</strong> — this will be saved as your{" "}
                    <strong>default.</strong>{" "}
                    <strong>
                      You’ll always be able to change this configuration later
                      if needed.
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-[#e5e7ea] p-5 space-y-2 max-w-[900px] mx-auto">
                <div className="sm:text-xl text-lg font-semibold">
                  BRITE Platform Monthly Fee
                </div>
                <div className="space-y-2">
                  <div>
                    Your practice will be charged{" "}
                    <strong>$99/month per provider</strong> to use the BRITE
                    platform and services.
                  </div>
                  <div>
                    This fee{" "}
                    <strong>
                      begins only when a provider has active patients receiving
                      prescriptions.
                    </strong>
                  </div>
                  <div>
                    If a provider’s first patient quits or never reorders,
                    leaving them with no active patients, the monthly fee will
                    be paused — In such cases, please reach out to us, as we
                    won’t know otherwise.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="checkbox"
                className="cursor-pointer mt-1"
                checked={isChecked}
                onChange={() => {
                  setIsChecked(!isChecked);
                }}
              />
              <label htmlFor="checkbox" className="ml-2 mt-1 cursor-pointer">
                Please acknowledge that you’ve read and understood the pricing
                structure above.
              </label>
            </div>
          </div>
        </div>
      </div>
      <Footer
        handleNextStep={() => {
          isChecked
            ? setStep(13)
            : showToast(
                "Please acknowledge that you’ve read and understood the pricing structure above.",
                "error",
              );
        }}
        handlePreviousStep={() => {
          setStep(11);
        }}
      />
    </div>
  );
};

export default PricingModal;
