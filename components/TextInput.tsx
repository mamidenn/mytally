import classNames from "classnames";
import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";

interface TextInputProps {
  showError?: boolean;
  errorMessage?: string;
}

export const TextInput: FC<
  TextInputProps &
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ showError, errorMessage, ...props }) => {
  return (
    <div>
      <input
        type="text"
        {...props}
        className={classNames(
          "bg-transparent border-b-2 w-full outline-none focus:border-emerald-500 rounded-none",
          {
            "border-red-500": showError,
            "focus:border-red-500": showError,
          },
          props.className
        )}
      />
      <p
        className={classNames("text-sm text-red-500", {
          invisible: !showError,
        })}
      >
        {errorMessage}
      </p>
    </div>
  );
};

export default TextInput;
