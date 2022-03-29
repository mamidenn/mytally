import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, FormEventHandler, useEffect, useState } from "react";
import Button from "components/Button";
import TextInput from "components/TextInput";
import { getRandomId, validateId } from "modules/tally";

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    randomId: getRandomId(),
  },
});

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
    setIsValid(!tallyId || validateId(tallyId));
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
            <TextInput
              placeholder={randomId}
              onChange={(e) => setTallyId(e.target.value)}
              minLength={1}
              maxLength={16}
              showError={submitted && !isValid}
              errorMessage="Your Tally ID must be 1-16 characters and/or numbers."
            />
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
