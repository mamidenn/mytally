import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Tally } from "../../../../hooks/useTally";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(req.query.tallyId as string).match("^[a-zA-Z0-9]{1,16}$")) {
    res.status(404).send(null);
    return;
  }
  const client = new MongoClient(process.env.CONNECTION_STRING!);
  try {
    await client.connect();
    const database = client.db();
    const tallies = database.collection("tallies");
    const filter = { id: req.query.tallyId };

    const result = await tallies.findOne<Tally>(filter);
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
      await tallies.insertOne(tally);
      res.status(200).json(tally);
    }
  } finally {
    client.close();
  }
}
