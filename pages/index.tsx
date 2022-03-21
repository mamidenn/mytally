import classNames from "classnames";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, FormEventHandler, useEffect, useState } from "react";
import Button from "../components/Button";
import { randomInt } from "crypto";
import { range } from "lodash";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      randomId: range(8).reduce(
        (c, _) => (c += randomInt(36).toString(36)),
        ""
      ),
    },
  };
};

export const CreateTally: FC<{ randomId: string }> = ({ randomId }) => {
  const [tallyId, setTallyId] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!tallyId) {
      router.push(randomId);
      return;
    }
    setSubmitted(true);
    if (isValid) router.push(tallyId);
  };

  useEffect(() => {
    setIsValid(tallyId.match("^[a-zA-Z0-9]{1,16}$") !== null);
  }, [tallyId]);

  return (
    <div className="container mx-auto flex flex-col justify-center h-screen">
      <h1 className="text-6xl font-semibold text-emerald-500 pb-6">
        Create your Tally
      </h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row justify-between"
      >
        <div className="flex basis-full text-3xl m-4">
          <p>mytally.de/</p>
          <div className="basis-full">
            <input
              type="text"
              value={tallyId}
              placeholder={randomId}
              onChange={(e) => {
                setTallyId(e.target.value);
              }}
              minLength={1}
              maxLength={16}
              className={classNames(
                "bg-transparent border-b-2 w-full outline-none focus:border-emerald-500 rounded-none",
                {
                  "border-red-500": !isValid && submitted,
                }
              )}
            />
            <p
              className={classNames("text-sm text-red-500", {
                invisible: isValid || !submitted,
              })}
            >
              Your Tally ID must be 1-16 characters and/or numbers.
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <Button
            type="submit"
            className="bg-emerald-500 p-2 m-4 text-white dark:text-black text-2xl font-semibold rounded-md ring-1 ring-gray-900/5"
            size="lg"
          >
            Let&apos;s go!
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTally;
