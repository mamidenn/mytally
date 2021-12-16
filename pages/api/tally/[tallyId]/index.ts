import type { NextApiRequest, NextApiResponse } from "next";
import { Tally } from "../../../../hooks/useTally";
import { clientPromise } from "../../../../modules/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(req.query.tallyId as string).match("^[a-zA-Z0-9]{1,16}$")) {
    res.status(404).send(null);
    return;
  }

  console.time("connect");
  const client = await clientPromise;
  console.timeEnd("connect");

  const tallies = client.db().collection("tallies");
  const filter = { id: req.query.tallyId };

  console.time("find");
  const result = await tallies.findOne<Tally>(filter);
  console.timeEnd("find");

  if (result) {
    res
      .status(200)
      .json(
        (({ id, count, lastUpdate }) => ({ id, count, lastUpdate }))(result)
      );
  } else {
    const tally = {
      id: req.query.tallyId,
      count: 0,
      lastUpdate: new Date(),
    };

    console.time("insert");
    await tallies.insertOne(tally);
    console.timeEnd("insert");

    res.status(200).json(tally);
  }
}
