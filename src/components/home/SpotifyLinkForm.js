import React, { useState, useEffect } from "react";
import EpisodeDetails from "@/components/home/EpisodeDetails";
import { ColorRing } from "react-loader-spinner";
import styles from "@/styles/components/home/SpotifyLinkForm.module.css";
import HintUI from "./HintUI";

const SpotifyLinkForm = () => {
  const [episodeData, setEpisodeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(null);

  const ErrorComponent = ({ error }) => {
    return (
      <div className={styles.errorContainer}>
        Error {error.status}: {error.message}
      </div>
    );
  };

  const LinkNotValidComponent = () => {
    return (
      <div
        style={{
          backgroundColor: "rgb(224, 54, 66)",
          padding: 10,
          borderRadius: 4,
          fontSize: 17,
          color: "white",
        }}
      >
        Link not valid
      </div>
    );
  };

  async function getToken() {
    const url = "https://accounts.spotify.com/api/token";
    const data = {
      grant_type: "client_credentials",
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data).toString(),
    };
    const response = await fetch(url, options);
    const json = await response.json();
    return json.access_token;
  }

  const validateLink = (link) => {
    const pattern =
      /^https:\/\/open\.spotify\.com\/episode\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9_-]+$/;
    const match = pattern.test(link);

    if (match) {
      setValidLink(true);
      // console.log(true);
      return true;
    } else {
      setValidLink(false);
      // console.log(false);
      return false;
    }
  };

  const handleInput = async (e) => {
    const link = e.target.value;
    if (link == "") {
      setValidLink(null);
      return;
    }

    if (validateLink(link)) {
      setLoading(true);

      //extract the episode id
      const episodeId = link.slice(33, 55);

      //make spotify query for the episode
      const url =
        "https://api.spotify.com/v1/episodes/" + episodeId + "?market=US";
      const token = await getToken();
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          // if (!response.ok) {
          //   // console.log(response.status);
          //   throw new Error(response.status);
          // }
          return response.json();
        })
        .then((data) => {
          setLoading(false);
          setEpisodeData(data);
          // Handle the response data
          // console.log(data);
        })
        .catch((error) => {
          // Handle any errors
          setLoading(false);
          setEpisodeData({
            error: { status: "unknown", message: "Unknown Error" },
          });
          console.error(error);
        });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.linkContainer}>
        <input
          className={styles.linkInput}
          type="search"
          placeholder="Enter Spotify Link"
          id="link"
          name="link"
          onChange={handleInput}
        />
      </form>

      {validLink != null ? ( //if no link has been added yet
        validLink == false ? ( //if not a valid link was added
          <LinkNotValidComponent />
        ) : loading ? ( //if link is valid and loading
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        ) : //once link is loaded
        episodeData.hasOwnProperty("error") ? ( //if error in link
          <ErrorComponent error={episodeData.error} />
        ) : (
          //if no error
          <EpisodeDetails data={episodeData} />
        )
      ) : (
        <>
          <HintUI />
        </>
      )}
    </div>
  );
};

export default SpotifyLinkForm;
