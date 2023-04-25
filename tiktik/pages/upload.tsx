import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { client } from "@/utils/client";
import { data } from "autoprefixer";
import { SanityAssetDocument } from "@sanity/client";
import { topics } from "@/utils/constants";
import postedBy from "@/sanity-backend/schemas/postedBy";

const Upload = () => {
  const [isLoading, setisLoading] = useState(false);
  const [videoAsset, setvideoAsset] = useState<
    SanityAssetDocument | undefined
  >();
  const [wrongFileType, setwrongFileType] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(topics[0].name);
  const [savingPost, setSavingPost] = useState(false);

  const { userProfile }: { userProfile: any } = useAuthStore();
  const router = useRouter();

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"];

    if (fileTypes.includes(selectedFile.type)) {
      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((data) => {
          setvideoAsset(data);
          setisLoading(false);
        });
    } else {
      setisLoading(false);
      setwrongFileType(true);
    }
  };

  const handlePost = async () => {
    if (caption && videoAsset?._id && category) {
      setSavingPost(true);

      const document = {
        _type: "post",
        caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic: category,
      };

      await axios.post(`http://localhost:3000/api/post`, document);
      router.push("/");
    }
  };

  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-4 pt-10 lg:pt-10 bg-[#f8f8f8] justify-center">
      <div className="bg-white w-[70%] rounded-lg mb-10 lg:h-[80vh]  flex gap-6 flex-wrap justify-center lg:justify-between items-center p-14 pt-6 h-full">
        <div>
          <div>
            <p className="text-2xl font-bold">Upload Video</p>
            <p className="text-md text-gray-400 mt-1">
              Post a video to your account
            </p>
          </div>
          <div
            className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-4 w-[260px]  p-4 cursor-pointer
          hover:border-red-300 hover:bg-gray-100"
          >
            {isLoading ? (
              <p className="text-center text-3xl text-red-400 font-semibold">
                Uploading
              </p>
            ) : (
              <div>
                {videoAsset ? (
                  <div>
                    <video
                      src={videoAsset.url}
                      loop
                      controls
                      className="rounded-xl h-[450px] bg-black"
                    ></video>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div
                      className="flex flex-col items-center 
                        justify-center h-full"
                    >
                      <div
                        className="flex flex-col items-center 
                        justify-center "
                      >
                        <p className="font-bold text-xl">
                          <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                        </p>
                        <p className="text-xl font-semibold">Upload Video</p>
                      </div>
                      <p className="text-gray-400 text-center mt-4 text-sm leading-10">
                        MP4 or WebM or ogg <br />
                        720x1280 or higher <br />
                        Up to 10 minutes <br />
                        Less than 2GB
                      </p>
                      <p className="bg-[#F51997] text-center mt-4 rounded text-white text-md font-medium p-2 w-52 outline-none">
                        Select File
                      </p>
                      <input
                        type="file"
                        className="w-0 h-0"
                        name="upload-video"
                        onChange={uploadVideo}
                      />
                    </div>
                  </label>
                )}
              </div>
            )}
            {wrongFileType && (
              <p className="text-xl text-center text-red-400 font-semibold mt-4 w-[250px]">
                Please select a video file
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 pb-10">
          <label htmlFor="" className="text-md font-medium">
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="rounded outline-none text-md border-2 border-gray-200 p-2"
          />
          <label htmlFor="" className="text-md font-medium">
            Choose a Category
          </label>
          <select
            className="outline-none border-2 border-gray-200 text-md  p-2 rounded cursor-pointer"
            name=""
            id=""
            onChange={(e) => setCategory(e.target.value)}
          >
            {topics.map((topic) => (
              <option
                value=""
                key={topic.name}
                className="outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
              >
                {" "}
                {topic.name}
              </option>
            ))}
          </select>
          <div className="flex gap-6 mt-0 ">
            <button
              onClick={() => {}}
              type="button"
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              Discard
            </button>
            <button
              onClick={handlePost}
              type="button"
              className="bg-[#f51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
