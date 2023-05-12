// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/utils/client";
type Data = {
  name: string;
};
import { searchPostsQuery } from "@/utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { searchTerm } = req.query;
    const VideosQuery = searchPostsQuery(searchTerm);
    const videos = await client.fetch(VideosQuery);

    res.status(200).json(videos);
  }
}
