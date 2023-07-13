import React, { useState, useEffect } from "react";
import EpisodeDetails from "@/components/EpisodeDetails";
import { ColorRing } from "react-loader-spinner";
import styles from "@/styles/components/SpotifyLinkForm.module.css";

const SpotifyLinkForm = () => {
  const [episodeData, setEpisodeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(null);

  const ErrorComponent = ({ error }) => {
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

  const handleInput = (e) => {
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
      const token =
        "BQDXFUZENCFAW4rk_lLR8qFQZU_AsSOvu0ZxbDQJhd8H6l_VLSPIj1xX1zy9fkrpOlgXn8WQRcyXSaopkEIljcu_AS1ndClfl-e2-KJF0EQ4zCZRnFA";
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <form className={styles.linkContainer}>
        <label htmlFor="link">Spotify Link:</label>
        <input
          type="text"
          id="link"
          name="link"
          onChange={handleInput}
          style={{ width: 300, marginLeft: 20 }}
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
        <></>
      )}
    </div>
  );
};

export default SpotifyLinkForm;
