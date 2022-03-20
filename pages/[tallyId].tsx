import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Tally } from "../hooks/useTally";
import { TallyCard } from "../components/TallyCard";
import { Pusher } from "../components/Pusher";

const TallyPage: FC = () => {
  const router = useRouter();
  const tallyIds = (router.query.tallyId as string)?.split("+");

  return (
    <>
      <Pusher>
        <div className="flex justify-center min-h-screen">
          <div className="flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8">
              {tallyIds &&
                tallyIds.map((id) => <TallyCard key={id} tallyId={id} />)}
            </div>
          </div>
        </div>
      </Pusher>
    </>
  );
};

export default TallyPage;
