import type { NextApiRequest, NextApiResponse } from "next";
import { Tally } from "../../../../hooks/useTally";
import { MongoClient } from "mongodb";
import Pusher from "pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(400).send(null);
  }

  const client = new MongoClient(process.env.CONNECTION_STRING!);

  const pusher = new Pusher({
    appId: process.env.PUSHER_APPID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });

  try {
    await client.connect();
    const database = client.db();
    const tallies = database.collection("tallies");
    const filter = { id: req.query.tallyId };

    const result = await tallies.findOneAndUpdate(
      filter,
      {
        $set: {
          lastUpdate: new Date(),
          count: 0,
        },
      },
      { returnDocument: "after" }
    );

    try {
      await pusher.trigger(`tally-${req.query.tallyId}`, "update", {
        ...(({ id, count, lastUpdate }) => ({ id, count, lastUpdate }))(
          result.value as Tally
        ),
        clientId: JSON.parse(req.body).clientId,
      });
    } catch (e) {
      console.error(e);
    }
  } finally {
    client.close();
  }

  res.status(200).send(null);
}
