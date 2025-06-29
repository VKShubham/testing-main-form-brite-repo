import { Loader } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";

interface PDFGenerationOverlayProps {
  isGenerating: boolean;
  progress: number;
}

const PDFGenerationOverlay: React.FC<PDFGenerationOverlayProps> = ({
  isGenerating,
  progress,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Preparing document...");
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  
  // Update status message based on progress
  useEffect(() => {
    if (progress < 30) {
      setStatusMessage("Preparing document...");
    } else if (progress < 60) {
      setStatusMessage("Processing pages...");
    } else if (progress < 90) {
      setStatusMessage("Optimizing output...");
    } else {
      setStatusMessage("Finalizing PDF...");
    }
  }, [progress]);

  // Improved animation with time-based easing
  useEffect(() => {
    if (!isGenerating) {
      // Reset animation when not generating
      setAnimatedProgress(0);
      return;
    }
    
    const animate = (timestamp: number) => {
      if (previousTimeRef.current === 0) {
        previousTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - previousTimeRef.current;
      // Slower easing for smoother animation (adjust the divisor for speed)
      const frameProgress = Math.min(elapsed / 16, 1);
      
      setAnimatedProgress((prev) => {
        // Use cubic easing for smoother transition
        const easing = 0.08 * frameProgress; 
        const delta = progress - prev;
        
        // Stop animating when we're close enough to target value
        if (Math.abs(delta) < 0.1) return progress;
        
        // Calculate new value with easing
        return prev + delta * easing;
      });
      
      previousTimeRef.current = timestamp;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    
    // Clean up animation frame on unmount or when isGenerating changes
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = 0;
    };
  }, [isGenerating, progress]);

  if (!isGenerating) return null;

  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{ 
        transition: 'opacity 0.3s ease',
      }}
    >
      <div 
        className="bg-white p-8 rounded-lg  text-center max-w-sm w-full"
        style={{ 
          transform: 'translateY(0)',
          opacity: 1,
          transition: 'transform 0.3s ease, opacity 0.3s ease'
        }}
      >
        {/* Simplified Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-6">
      
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold !text-blue-500">
                {Math.round(animatedProgress)}
              </span>
              <span className="text-xl font-bold !text-blue-500">%</span>
            </div>
          </div>
        </div>

          <Loader color="#45bda6" size="xl" type="dots" />

        {/* Heading */}
        <h3 className="text-2xl font-bold mb-2 !text-gray-800">Generating PDF</h3>
        <p className="!text-gray-600 mb-5 text-sm">
          Please wait while we prepare your document...
        </p>

       


        {/* Status Message with fade transition */}
        <div className="h-6 mt-3">
          <p 
            className="text-sm !text-gray-500"
            style={{
              transition: 'opacity 0.3s ease',
              opacity: 1
            }}
          >
            {statusMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFGenerationOverlay;