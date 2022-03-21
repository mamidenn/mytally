import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Tally } from "../hooks/useTally";
import { TallyCard } from "../components/TallyCard";
import { Pusher } from "../components/Pusher";
import classNames from "classnames";

const TallyPage: FC = () => {
  const router = useRouter();
  const tallyIds = (router.query.tallyId as string)?.split("+");
  const [titleTally, setTitleTally] = useState<Tally>();

  return (
    <>
      {tallyIds?.length == 1 && (
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
            </div>
          )}
        </div>
      </Pusher>
    </>
  );
};

export default TallyPage;
