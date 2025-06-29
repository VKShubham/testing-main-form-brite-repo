import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { Loader, Button, Alert } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

interface LogoData {
  name: string;
  dataUrl: string;
}

interface FormDataType {
  logo?: LogoData;
  [key: string]: any;
}

// Hook for beforeunload
const useBeforeUnload = (enabled: boolean, message: string) => {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!enabled) return;
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled, message]);
};

// Utility: Convert dataURL to Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
};

// Utility: Fetch with timeout
const fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeout = 15000
): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
};

// Get PDF from IndexedDB
const getPdfFromIndexedDB = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BriteDB", 1);

    request.onerror = () => reject("Failed to open IndexedDB");

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["pdfData"], "readonly");
      const store = transaction.objectStore("pdfData");
      const getRequest = store.get("currentPdf");

      getRequest.onsuccess = () => resolve(getRequest.result);
      getRequest.onerror = () =>
        reject("Failed to retrieve PDF from IndexedDB");
    };
  });
};

const PaymentSuccess = () => {
  const { formData, setFormData } = useContext(AppContext) as {
    formData: FormDataType;
    setFormData: (data: any) => void;
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmissionComplete, setIsSubmissionComplete] = useState(false);

  // Protect unload
  useBeforeUnload(loading && !isSubmissionComplete, "Your form is still being submitted. If you leave now, your data may not be saved.");

  const sendData = async () => {
    const scriptURL = import.meta.env.VITE_SCRIPT_URL;
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const sessionId = sessionStorage.getItem("stripe_session_id");

    if (!sessionId) {
      throw new Error("No payment session found. Please complete payment first.");
    }

    if (import.meta.env.DEV) {
      console.log("Script URL:", scriptURL);
      console.log("Session ID:", sessionId);
    }

    setLoading(true);
    setError(null);
    setIsSubmissionComplete(false);

    try {
      const pdfFile = await getPdfFromIndexedDB();

      if (!formData.logo?.dataUrl || !pdfFile?.dataUrl) {
        throw new Error("Missing logo or PDF");
      }

      const logoBlob = dataURLtoBlob(formData.logo.dataUrl);
      const pdfBlob = dataURLtoBlob(pdfFile.dataUrl);

      const formDataToSend = new FormData();
      formDataToSend.append("logo", logoBlob, formData.logo.name);
      formDataToSend.append("pdf", pdfBlob, pdfFile.name || "document.pdf");

      Object.keys(formData).forEach((key) => {
        if (key !== "logo") {
          const value = formData[key];
          formDataToSend.append(key, typeof value === "object" ? JSON.stringify(value) : value);
        }
      }); 

      const response = await fetchWithTimeout(`${backendURL}/send-data`, {
        method: "POST",
        credentials: "include",
        headers: {
          'X-Session-Id': sessionId,
        },
        body: formDataToSend,
      });

      if (response.status === 402) {
        throw new Error("Payment verification failed. Please contact support.");
      }

      if (response.status === 413) {
        throw new Error("Uploaded files are too large. Please reduce the file size.");
      }

      if (response.status !== 200) {
        const text = await response.text();
        throw new Error(`Server error ${response.status}: ${text}`);
      }

      setIsSubmissionComplete(true);
      setFormData({});
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = "/success";
      }, 100);

    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sendData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center flex-col p-4">
        <div className="w-full max-w-md mb-6">
          <Alert
            icon={<IconAlertTriangle size="1.1rem" />}
            title="⚠️ Important Notice"
            color="orange"
            className="animate-pulse border-2 border-orange-300"
          >
            <div className="font-semibold text-orange-800">
              <p className="mb-2">🚫 <strong>DO NOT CLOSE THIS WINDOW!</strong></p>
              <p className="text-sm">
                Your form is being submitted. If you close this window now,
                your data may not be saved and you'll need to start over.
              </p>
            </div>
          </Alert>
        </div>

        <div className="text-center flex flex-col justify-center items-center">
          <p className="text-black text-lg mb-4 font-medium">
            Please hold on while we process your submission...
          </p>
          <Loader color="#45bda6" size="xl" type="dots" />

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">
              📋 Your form is being processed securely
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              Please keep this window open until the process completes
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center flex-col text-center px-4">
        <div className="w-full max-w-md mb-6">
          <Alert
            icon={<IconAlertTriangle size="1.1rem" />}
            title="❌ Submission Failed"
            color="red"
            className="border-2 border-red-300"
          >
            <p className="text-red-800 font-semibold mb-2">
              Your form was not submitted successfully!
            </p>
            <p className="text-red-700 text-sm">
              Your data has not been saved. Please try again.
            </p>
          </Alert>
        </div>

        <p className="text-red-600 text-lg mb-4 font-semibold">{error}</p>
        <Button onClick={sendData} color="teal" size="md" radius="md">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* <img
        className="h-screen w-full object-cover max-[700px]:hidden"
        src="./payment_success_desktop.jpg"
        alt="Payment Success Desktop"
      />
      <img
        className="h-screen w-full object-cover min-[700px]:hidden"
        src="./payment_success_mobile.jpg"
        alt="Payment Success Mobile"
      /> */}
    </div>
  );
};

export default PaymentSuccess;
