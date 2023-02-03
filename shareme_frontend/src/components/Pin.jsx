import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";
import useAuthStore from "../store/authStore";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();

  const { user } = useAuthStore();

  const [saved, setSaved] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const alreadySaved = !!save?.filter((item) => item.postedBy._id === user?._id)
    ?.length;

  const savePin = () => {
    if (!alreadySaved) {
      setSavingPost(true);
      client
        .patch(_id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user._id,
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          setSaved(true);
          setSavingPost(false);
        });
    }
  };

  const deletePin = () => {
    client.delete(_id).then(() => {
      setDeleted(true);
    });
  };

  return (
    <>
      {!deleted && (
        <div className="m-2">
          <div
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className="relative cursor-zoom-in w-auto hover:shadow-lg hover:contrast-200 hover:scale-105 rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
          >
            {image && (
              <img
                src={urlFor(image).width(250).url()}
                alt="user-post"
                className="rounded-lg w-full"
              />
            )}

            {postHovered && (
              <div
                className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                style={{ height: "100%" }}
              >
                <div className="flex items-center justify-between ">
                  <div className="flex gap-2 ">
                    <a
                      href={`${image?.asset?.url}?dl=`}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                    >
                      <MdDownloadForOffline />
                    </a>
                  </div>
                  {user && (
                    <>
                      {alreadySaved || saved ? (
                        <button
                          type="button"
                          className="bg-black opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                        >
                          Saved
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            savePin();
                          }}
                          disabled={savingPost}
                          type="button"
                          className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                        >
                          {savingPost ? "Saving..." : "Save"}
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center gap-2 w-full">
                  {destination && (
                    <a
                      href={destination}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white flex items-center gap-2 text-black font-bold p-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md "
                    >
                      <BsFillArrowUpRightCircleFill />
                      {destination.length > 20
                        ? destination.slice(8, 20)
                        : destination.slice(8)}
                    </a>
                  )}
                  {postedBy?._id === user?._id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePin();
                      }}
                      className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none"
                      type="button"
                    >
                      <AiTwotoneDelete />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <Link
            to={`/user-profile/${postedBy._id}`}
            className="flex gap-2 mt-2 items-center"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={postedBy.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">{postedBy.userName}</p>
          </Link>
        </div>
      )}
    </>
  );
};

export default Pin;
