import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Tally } from "../hooks/useTally";
import { TallyCard } from "../components/TallyCard";
import { Pusher } from "../components/Pusher";

const TallyPage: FC = () => {
  const router = useRouter();
  const tallyId = router.query.tallyId as string | undefined;
  const [tally, setTally] = useState<Tally>();

  return (
    <>
      <Head>
        <title>
          {tally && tally?.count + " | " + tally?.id + " | "}myTally - shared
          tally counters
        </title>
      </Head>
      <Pusher>
        <div className="flex justify-center items-center h-screen">
          {tallyId && (
            <TallyCard tallyId={tallyId} onTally={(t) => setTally(t)} />
          )}
        </div>
      </Pusher>
    </>
  );
};

export default TallyPage;
