import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Tally } from "../../../../hooks/useTally";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        .send(
          (({ id, count, lastUpdate }) => ({ id, count, lastUpdate }))(result)
        );
    }
    res.status(404).send(null);
  } finally {
    client.close();
  }
}
