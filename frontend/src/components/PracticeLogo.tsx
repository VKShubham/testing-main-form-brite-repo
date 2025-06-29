import { useContext, useState } from "react";
import { Dropzone } from "@mantine/dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Button } from "@mantine/core";
import Footer from "../common/Footer";
import Heading from "../common/Heading";
import AppContext from "../context/AppContext";
import useInputChange from "../hooks/useInputChange";
import { showToast } from "../common/toast";

interface StoredFileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  dataUrl: string;
}

const PracticeLogo: React.FC = () => {
  const { setStep, formData } = useContext(AppContext);
  const handleInputChange = useInputChange();

  // formData.logo might be a StoredFileData object rather than a File.
  const [selectedFile, setSelectedFile] = useState<
    File | StoredFileData | null
  >(formData.logo ?? null);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      // Read the file as a data URL so we can store it
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Store an object with both file meta and base64 data
        const fileData: StoredFileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          dataUrl, // base64 representation
        };
        // Save this object using your context's input change handler.
        handleInputChange("logo", fileData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container-home bg-main">
      <div className="px-10">
        <Heading text="Upload your Practice Logo" />
        <div className="mb-5">
          <Dropzone
            onDrop={handleDrop}
            accept={{
              "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
            }}
            maxSize={10.6 * 1024 * 1024} // 10.6 MB in bytes
          >
            <div className="md:flex grid items-center justify-between gap-5 py-5">
              <div className="flex items-center gap-3">
                <AiOutlineCloudUpload size={60} className="text-[#45bda6]" />
                <div>
                  <div className="text-[#666666] text-xl font-bold">
                    Drag and drop files here
                  </div>
                  <div className="text-sm text-[#666666] font-bold">
                    Max File Size: 10.6MB
                  </div>
                </div>
              </div>
              <div>
                <Button
                  color="#45bda6"
                  variant="outline"
                  className="!text-lg !px-22 max-sm:!px-10 !h-12"
                >
                  Browse Files
                </Button>
                <div>
                  {selectedFile
                    ? "name" in selectedFile
                      ? selectedFile.name.length > 30
                        ? `${selectedFile.name.substring(0, 30)}...`
                        : selectedFile.name
                      : ""
                    : "No file selected"}
                </div>
              </div>
            </div>
            <div className="text-red-500 text-sm">
              Only image files (PNG, JPG, JPEG) are accepted. If your logo is in
              a PDF or other format, please take a screenshot and
              upload it here.
            </div>
          </Dropzone>
        </div>
      </div>
      <Footer
        handleNextStep={() => {
          if (!selectedFile) {
            showToast("Please upload a logo before proceeding.", "error");
            return;
          }
          setStep(3);
        }}
        handlePreviousStep={() => setStep(1)}
      />
    </div>
  );
};

export default PracticeLogo;
