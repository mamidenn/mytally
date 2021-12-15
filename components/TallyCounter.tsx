import classNames from "classnames";
import { ButtonHTMLAttributes, FC, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const animationDuration = 100;

type Animation = "inc" | "dec";

const Number: FC<{
  animation: Animation | null;
}> = (props) => {
  return (
    <div
      className={classNames("relative -top-32", {
        [`transition-transform ease-in duration-${animationDuration}`]:
          props.animation,
        "-translate-y-full": props.animation === "inc",
        "translate-y-full": props.animation === "dec",
      })}
    >
      {props.children}
    </div>
  );
};

export const TallyCounter: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { tally: number | undefined }
> = (props) => {
  const [tally, setTally] = useState(props.tally);
  const [nextTally, setNextTally] = useState<number | undefined>(0);
  const [animation, setAnimation] = useState<Animation | null>(null);

  useEffect(() => {
    const playAnimation = (animation: Animation) => {
      setNextTally(props.tally);
      setAnimation(animation);
      delay(animationDuration).then(() => {
        setAnimation(null);
        setTally(props.tally);
      });
    };
    if (props.tally !== undefined) {
      if (tally !== undefined) {
        if (props.tally > tally) {
          playAnimation("inc");
        } else if (props.tally < tally) {
          playAnimation("dec");
        }
      } else {
        setTally(props.tally);
      }
    }
  }, [props.tally, tally]);

  return (
    <div className={classNames("flex items-center m-4 h-32", props.className)}>
      {tally !== undefined && (
        <button {...props} className="text-9xl font-bold">
          <div className="overflow-hidden h-32">
            {[nextTally, tally, nextTally].map((v, idx) => (
              <Number key={idx} animation={animation}>
                {v}
              </Number>
            ))}
          </div>
        </button>
      )}
      {/* <ScaleLoader loading={tally === undefined} color="#10B981" radius={8} /> */}
    </div>
  );
};

export default TallyCounter;
