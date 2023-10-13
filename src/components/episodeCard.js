import React from "react";
import { useRouter } from "next/router";

export default function EpisodeCard({
  title,
  subTitle,
  imageUrl,
  status,
  redirectUrl,
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(redirectUrl);
  };

  return (
    <article className="mx-1 cursor-pointer mb-10 rounded-xl bg-[#29282b] pb-5 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 h-[300px] w-[300px]">
      <div
        style={{ "--image-url": `url(${imageUrl})` }}
        className="h-[300px] w-[300px] bg-[image:var(--image-url)] relative flex flex-column items-end overflow-hidden rounded"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
          className=" relative z-2"
        ></div>
        <div className="mt-4 px-5 py-5 relative z-3">
          {status !== "Completed" ? (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full mr-2 px-2.5 py-0.5 dark:bg-blue-900 dark:text-blue-300">
              Processing
            </span>
          ) : (
            <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full mr-2 px-2.5 py-0.5 dark:bg-green-900 dark:text-green-300">
              Completed
            </span>
          )}
          <h2 className="font-sans text-white mt-2 text-base font-semibold">
            {title}
          </h2>
          <p className="mt-1 text-sm text-white font-light">{subTitle}</p>
          <div className="mt-6 flex items-center justify-between">
            {status === "Completed" ? (
              <div className="flex items-center space-x-1.5 rounded-lg bg-[#6a6bf3] px-4 py-2 text-white duration-100 hover:bg-[#6a6bf3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <button onClick={() => handleClick()} className="text-xs">
                  View Summary
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
