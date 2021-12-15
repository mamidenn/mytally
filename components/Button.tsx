import classNames from "classnames";
import { ButtonHTMLAttributes, FC, useState } from "react";

export const Button: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: "flat" | "sm" | "md" | "lg";
  }
> = (props) => {
  const [pressed, setPressed] = useState(false);
  const size = props.size ?? "md";

  return (
    <button
      {...props}
      className={classNames(props.className, {
        [`shadow-${size}`]: !pressed,
        "translate-y-px": pressed && size === "lg",
      })}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {props.children}
    </button>
  );
};

export default Button;
