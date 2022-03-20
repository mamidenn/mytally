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
        <div className="flex justify-center min-h-screen">
          <div className="flex flex-col justify-center">
            {tallyIds && (
              <div
                className={classNames(
                  "grid gap-8 py-8 grid-cols-1 ",
                  [`md:grid-cols-${Math.min(tallyIds.length, 2)}`],
                  [`lg:grid-cols-${Math.min(tallyIds.length, 3)}`],
                  [`xl:grid-cols-${Math.min(tallyIds.length, 4)}`]
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
        </div>
      </Pusher>
    </>
  );
};

export default TallyPage;
