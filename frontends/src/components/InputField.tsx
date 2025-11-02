import React, { useEffect, useState } from "react";
import { useTheme } from "../stores/ThemeProvider";

interface inputs {
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholders: string;
  textarea?: boolean;
}
const InputField: React.FC<inputs> = ({
  type,
  id,
  name,
  value,
  placeholders,
  onChange,
  textarea,
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  // const [value, setValue] = useState<string>("");
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!value ) {
      setFocused(false); //  value lai empty garepachi reset garnxa label 
    }
    else{
      setFocused(true);
    }
  }, [value]);

  return (
    <div className="relative pt-0">
      {!textarea ? (
        <div className="relative">
          <input
            type={type}
            id={id}
            name={name}
            autoComplete="off"
            onFocus={() => setFocused(true)}
            onBlur={() => {
              !value && setFocused(value !== "");
            }} // stay up if value not empty
            value={value}
            onChange={onChange}
            className={` 
              w-full border-2 ${theme === "dark" ? "" : ""}  px-2 pt-4 pb-1
              text-base outline-none
              ${
                theme === "dark"
                  ? "border-gray-400 focus:border-[#C778DD] "
                  : "border-gray-600 focus:border-[#a840c5]"
              }
              `}
          />

          <label
            htmlFor={id}
            className={`
              absolute left-4 pointer-events-none
              ${theme === "dark" ? `bg-[#0f0f0f]` : `bg-[#f3f3f3]`}
              ${
                focused
                  ? ` ${
                      theme === "dark" ? "text-[#C778DD]" : "text-[#a840c5]"
                    } text-sm -top-2 px-1 transition-all duration-200 ease-in-out`
                  : `  top-[0.66rem] px-2 text-[1.05rem]`
              }
            `}
          >
            {placeholders}
          </label>
        </div>
      ) : (
        <div>
          <textarea
            name={name}
            id={id}
            value={value}
            autoComplete="off"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(value !== "")} // stay up if value not empty
            onChange={onChange}
            className={` max-h-[20rem] min-h-[5rem]
              w-full border-2 ${theme === "dark" ? "" : ""}  px-2 pt-4 pb-1
              text-base outline-none
              ${
                theme === "dark"
                  ? "border-gray-400 focus:border-[#C778DD] "
                  : "border-gray-600 focus:border-[#a840c5]"
              }
              `}
          />
          <label
            htmlFor={id}
            className={`
              absolute left-4 pointer-events-none
              ${theme === "dark" ? `bg-[#0f0f0f]` : `bg-[#f3f3f3]`}
              ${
                focused
                  ? ` ${
                      theme === "dark" ? "text-[#C778DD]" : "text-[#a840c5]"
                    } text-sm -top-2 px-1 transition-all duration-200 ease-in-out`
                  : `  top-[0.66rem] px-2 text-[1.05rem]`
              }
            `}
          >
            {placeholders}
          </label>
        </div>
      )}
    </div>
  );
};

export default InputField;
