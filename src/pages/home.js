import React, { useState } from "react";
import EpisodeDetails from "@/components/EpisodeDetails";
import { ColorRing } from "react-loader-spinner";
import styles from "@/styles/Home.module.css";

import { getSession, useSession } from "next-auth/react";
import Header from "@/components/Header";

function HomePage() {
  const { data: session } = useSession({ required: true });

  const [episodeData, setEpisodeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [validLink, setValidLink] = useState(null);

  const dummyData = {
    audio_preview_url:
      "https://podz-content.spotifycdn.com/audio/clips/61Q4EZuIfZXVSB6QlXOD3C/clip_570300_620500.mp3",
    description:
      "Sabbaticals have long been thought of as an academic privilege, but a growing number of companies offer them, especially since the pandemic. DJ DiDonna, a senior lecturer at Harvard Business School and founder of The Sabbatical Project, has interviewed hundreds of workers who’ve taken them and studied organizations that offer them. From his research and his own experience on a sabbatical, DiDonna shares the surprising impacts that extended time off—paid or unpaid—can have on workers, teams, and the overall organization. And he explains how organizations can make sabbaticals work both financially and culturally.",
    duration_ms: 1605433,
    explicit: false,
    external_urls: {
      spotify: "https://open.spotify.com/episode/6BaFiYI847M9d10CUwkHFF",
    },
    href: "https://api.spotify.com/v1/episodes/6BaFiYI847M9d10CUwkHFF",
    html_description:
      "Sabbaticals have long been thought of as an academic privilege, but a growing number of companies offer them, especially since the pandemic. DJ DiDonna, a senior lecturer at Harvard Business School and founder of The Sabbatical Project, has interviewed hundreds of workers who’ve taken them and studied organizations that offer them. From his research and his own experience on a sabbatical, DiDonna shares the surprising impacts that extended time off—paid or unpaid—can have on workers, teams, and the overall organization. And he explains how organizations can make sabbaticals work both financially and culturally.",
    id: "6BaFiYI847M9d10CUwkHFF",
    images: [
      {
        height: 640,
        url: "https://i.scdn.co/image/ab6765630000ba8a2c2f2ab953bf8bf8c6a817ea",
        width: 640,
      },
      {
        height: 300,
        url: "https://i.scdn.co/image/ab67656300005f1f2c2f2ab953bf8bf8c6a817ea",
        width: 300,
      },
      {
        height: 64,
        url: "https://i.scdn.co/image/ab6765630000f68d2c2f2ab953bf8bf8c6a817ea",
        width: 64,
      },
    ],
    is_externally_hosted: false,
    is_playable: true,
    language: "en",
    languages: ["en"],
    name: "Why More Companies Should Have a Sabbatical Policy",
    release_date: "2023-06-06",
    release_date_precision: "day",
    show: {
      available_markets: [
        "AD",
        "AE",
        "AG",
        "AL",
        "AM",
        "AO",
        "AR",
        "AT",
        "AU",
        "AZ",
        "BA",
        "BB",
        "BE",
        "BF",
        "BG",
        "BH",
        "BI",
        "BJ",
        "BN",
        "BO",
        "BR",
        "BS",
        "BT",
        "BW",
        "BZ",
        "CA",
        "CH",
        "CI",
        "CL",
        "CM",
        "CO",
        "CR",
        "CV",
        "CW",
        "CY",
        "CZ",
        "DE",
        "DJ",
        "DK",
        "DM",
        "DO",
        "DZ",
        "EC",
        "EE",
        "EG",
        "ES",
        "FI",
        "FJ",
        "FM",
        "FR",
        "GA",
        "GB",
        "GD",
        "GE",
        "GH",
        "GM",
        "GN",
        "GQ",
        "GR",
        "GT",
        "GW",
        "GY",
        "HK",
        "HN",
        "HR",
        "HT",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IS",
        "IT",
        "JM",
        "JO",
        "JP",
        "KE",
        "KH",
        "KI",
        "KM",
        "KN",
        "KR",
        "KW",
        "LA",
        "LB",
        "LC",
        "LI",
        "LR",
        "LS",
        "LT",
        "LU",
        "LV",
        "MA",
        "MC",
        "ME",
        "MG",
        "MH",
        "MK",
        "ML",
        "MN",
        "MO",
        "MR",
        "MT",
        "MU",
        "MV",
        "MW",
        "MX",
        "MY",
        "MZ",
        "NA",
        "NE",
        "NG",
        "NI",
        "NL",
        "NO",
        "NP",
        "NR",
        "NZ",
        "OM",
        "PA",
        "PE",
        "PG",
        "PH",
        "PL",
        "PS",
        "PT",
        "PW",
        "PY",
        "QA",
        "RO",
        "RS",
        "RW",
        "SA",
        "SB",
        "SC",
        "SE",
        "SG",
        "SI",
        "SK",
        "SL",
        "SM",
        "SN",
        "SR",
        "ST",
        "SV",
        "SZ",
        "TD",
        "TG",
        "TH",
        "TL",
        "TN",
        "TO",
        "TR",
        "TT",
        "TV",
        "TW",
        "TZ",
        "UA",
        "US",
        "UY",
        "UZ",
        "VC",
        "VN",
        "VU",
        "WS",
        "XK",
        "ZA",
        "ZM",
        "ZW",
      ],
      copyrights: [],
      description:
        "A weekly podcast featuring the leading thinkers in business and management.",
      explicit: false,
      external_urls: {
        spotify: "https://open.spotify.com/show/4gtSBBxIAE142ApX6LqsvN",
      },
      href: "https://api.spotify.com/v1/shows/4gtSBBxIAE142ApX6LqsvN",
      html_description:
        "A weekly podcast featuring the leading thinkers in business and management.",
      id: "4gtSBBxIAE142ApX6LqsvN",
      images: [
        {
          height: 640,
          url: "https://i.scdn.co/image/ab6765630000ba8a2c2f2ab953bf8bf8c6a817ea",
          width: 640,
        },
        {
          height: 300,
          url: "https://i.scdn.co/image/ab67656300005f1f2c2f2ab953bf8bf8c6a817ea",
          width: 300,
        },
        {
          height: 64,
          url: "https://i.scdn.co/image/ab6765630000f68d2c2f2ab953bf8bf8c6a817ea",
          width: 64,
        },
      ],
      is_externally_hosted: false,
      languages: ["en"],
      media_type: "audio",
      name: "HBR IdeaCast",
      publisher: "Harvard Business Review",
      total_episodes: 648,
      type: "show",
      uri: "spotify:show:4gtSBBxIAE142ApX6LqsvN",
    },
    type: "episode",
    uri: "spotify:episode:6BaFiYI847M9d10CUwkHFF",
  };

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
        "BQCbB_8EIjBCg2xnMWkbkcVU2hR4Ulq9tNeviL2zEIHYNrmzyE5gPcEFJlYa4hSzq0Ok2iTiOSJWOhAfqdm4nOEtTD-RdffyhYnjyReZDuNPPDnnZwI";
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
      <Header loggedIn={true} />
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
}

HomePage.requireAuth = true;

export default HomePage;

// export const getServerSideProps = async (context) => {
//   const session = await getSession(context);
//   if (!session) {
//     return {
//       redirct: {
//         destination: "/",
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// };
