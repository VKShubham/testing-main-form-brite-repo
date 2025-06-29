// SignatureModal.tsx
import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignatureModal = ({ show, onClose, onSave }: { show: any, onClose: any, onSave: any }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sigCanvas: any = useRef(null);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = () => {
    const signature = sigCanvas.current.toDataURL("image/png");
    onSave(signature);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Sign Below</h2>
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: 350,
            height: 150,
            className: "border border-gray-400 rounded-xl",
          }}
        />
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg text-sm"
            onClick={clearSignature}
          >
            Retry
          </button>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-red-400 text-white rounded-lg text-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              onClick={saveSignature}
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
