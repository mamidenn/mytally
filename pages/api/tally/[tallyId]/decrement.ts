import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { Tally } from "../../../../hooks/useTally";
import { pusher } from "../../../../services/pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(400).send(null);
  }

  const client = new MongoClient(process.env.CONNECTION_STRING!);
  try {
    await client.connect();
    const database = client.db();
    const tallies = database.collection("tallies");
    const filter = { id: req.query.tallyId };

    //TODO make atomic
    const tally = await tallies.findOne<Tally>(filter);

    if (tally && tally.count > 0) {
      const result = await tallies.findOneAndUpdate(
        filter,
        {
          $set: {
            lastUpdate: new Date(),
          },
          $inc: { count: -1 },
        },
        { returnDocument: "after" }
      );

      pusher.trigger(
        `tally-${req.query.tallyId}`,
        "update",
        (({ id, count, lastUpdate }) => ({ id, count, lastUpdate }))(
          result.value as Tally
        )
      );
    }
  } finally {
    await client.close();
  }

  res.status(200).send(null);
}
