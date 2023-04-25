import { Inter } from "next/font/google";
import axios from "axios";
import type { NextPage } from "next";
import { Video } from "@/types";
import VideoCard from "@/components/VideoCard";
import NoResult from "@/components/NoResult";

interface IProps {
  videos: Video[];
}

const inter = Inter({ subsets: ["latin"] });

const Home = ({ videos }: IProps) => {
  console.log(videos);
  return (
    <main className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video: Video) => <VideoCard post={video} key={video._id} />)
      ) : (
        <NoResult text={"No Videos"} />
      )}
    </main>
  );
};

export const getServerSideProps = async () => {
  const { data } = await axios.get(`http://localhost:3000/api/post`);

  return {
    props: {
      videos: data,
    },
  };
};

export default Home;
