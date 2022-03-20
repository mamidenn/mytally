import type { NextApiRequest, NextApiResponse } from "next";
import { Tally } from "../../../../hooks/useTally";
import { clientPromise } from "../../../../modules/mongodb";
import { pusher } from "../../../../modules/pusher";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(400).json(null);
    return;
  }

  console.time("connect");
  const client = await clientPromise;
  console.timeEnd("connect");

  const tallies = client.db().collection("tallies");
  const filter = { id: req.query.tallyId };

  console.time("update");
  const result = await tallies.findOneAndUpdate(
    filter,
    {
      $set: {
        lastUpdate: new Date(),
      },
      $inc: { count: 1 },
    },
    { returnDocument: "after" }
  );
  console.timeEnd("update");

  if (!result.value) {
    res.status(404).json(null);
    return;
  }

  const updated = {
    ...(({ id, count, lastUpdate }) => ({ id, count, lastUpdate }))(
      result.value as Tally
    ),
  };

  console.time("push");
  await pusher.trigger(`tally-${req.query.tallyId}`, "update", updated, {
    socket_id: req.body.socketId,
  });
  console.timeEnd("push");

  res.status(200).json(updated);
}
