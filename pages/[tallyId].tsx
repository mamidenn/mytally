import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Tally } from "hooks/useTally";
import classNames from "classnames";
import { Button, Pusher, TallyCard, TextInput } from "components";
import { maxLength, minLength } from "modules/tally";

const TallyPage: FC = () => {
  const router = useRouter();
  const tallyIds = (router.query.tallyId as string)?.split("+");
  const [titleTally, setTitleTally] = useState<Tally>();
  const [addtlId, setAddtlId] = useState<string>();

  return (
    <>
      {tallyIds?.length == 1 && titleTally && (
        <Head>
          <title>
            {titleTally?.count} | {titleTally?.id} | myTally - shared tally
            counters
          </title>
        </Head>
      )}
      <Pusher>
        <div className="container mx-auto flex flex-col justify-center min-h-screen">
          {tallyIds && (
            <div
              className={classNames(
                "mx-8 grid gap-8 py-8 justify-items-center grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] "
              )}
            >
              {tallyIds.map((id) => (
                <TallyCard
                  key={id}
                  tallyId={id}
                  onTally={(t) => tallyIds.length == 1 && setTitleTally(t)}
                />
              ))}
              <div className="w-80 border-2 border-dashed rounded-lg flex justify-center">
                <form className="flex flex-col justify-center">
                  <TextInput
                    type="text"
                    minLength={minLength}
                    maxLength={maxLength}
                    className="text-center"
                    onChange={(e) => setAddtlId(e.target.value)}
                  ></TextInput>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-emerald-500 p-2 m-4 text-white dark:text-black text-lg font-semibold rounded-md ring-1 ring-gray-900/5"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`${tallyIds.join("+")}+${addtlId}`);
                    }}
                  >
                    Add
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </Pusher>
    </>
  );
};

export default TallyPage;
