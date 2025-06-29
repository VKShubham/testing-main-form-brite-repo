import React, { useState, useEffect, useContext } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import AppContext from '../context/AppContext';


const SliderWithImageThumb: React.FC = () => {
  const [value, setValue] = useState<number>(10);
  const { formData } = useContext(AppContext)
  useEffect(() => {
    const percent = value;
    const slider = document.querySelector('.custom-slider') as HTMLInputElement;
    if (slider) {
      slider.style.background = `linear-gradient(to right, #45b29a ${percent}%, white ${percent}%)`;
    }
    formData.commission = value;
    console.log(formData, "update commission");
  }, [value]);

  const increment = () => {
    setValue((prev) => Math.min(prev + 0.5, 100));
  };

  const decrement = () => {
    setValue((prev) => Math.max(prev - 0.5, 0));
  };

  return (
    <div className="w-full   px-4 -mt-2">
      <div className="relative flex items-center">
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full custom-slider"
        />

        {/* Buttons to the right */}
        <div className="flex flex-col items-center ml-4 space-y-1">
          <button
            onClick={increment}
            className="p-1 bg-white text-black rounded-full shadow hover:bg-gray-100"
          >
            <FaChevronUp className="text-[12px]" />
          </button>
          <button
            onClick={decrement}
            className="p-1 bg-white text-black rounded-full shadow hover:bg-gray-100"
          >
            <FaChevronDown className="text-[12px]" />
          </button>
        </div>
      </div>

      <div className="text-white text-2xl font-semibold mt-1 ">
        Practice Markup:
        <span className="text-red-600  ml-3">{value} %</span>
      </div>

      <p className="text-red-600 font-semibold mt-1 mb-5">
        Note: Your commission is capped at $85 per test order, even if you select 100% markup.
      </p>
    </div>
  );
};

export default SliderWithImageThumb;
