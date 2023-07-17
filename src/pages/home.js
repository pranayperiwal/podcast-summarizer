import React, { useState, useEffect } from "react";

import styles from "@/styles/Home.module.css";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Header from "@/components/Header";
import SpotifyLinkForm from "@/components/home/SpotifyLinkForm";
import { Divider } from "@mui/material";
import { atom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import InitialInformationModal from "@/components/home/InitialInformationModal";
import { prisma } from "@/pages/api/auth/[...nextauth]";

export const userUIDAtom = atom();
export const userEmailAtom = atom();

const HomePage = ({ user }) => {
  // console.log(user);

  useHydrateAtoms([[userUIDAtom, user.user_id]]);
  useHydrateAtoms([[userEmailAtom, user.email]]);

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    localStorage.setItem(user.user_id + "_seen_welcome_modal", true);
    setOpen(false);
  };

  useEffect(() => {
    let returningUser = localStorage.getItem(
      user.user_id + "_seen_welcome_modal"
    );
    // console.log(returningUser);
    setOpen(!returningUser);
  }, []);

  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div className={styles.contentContainer}>
        <div className={styles.contentHeader}>
          Enter the Spotify link of the podcast you would like to summarise
        </div>
        {/* <Divider /> */}
        <SpotifyLinkForm />
      </div>
      <div>
        <InitialInformationModal open={open} handleClose={handleClose} />
      </div>
    </div>
  );
};

HomePage.requireAuth = true;

export default HomePage;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      user_id: session.user.uid,
    },
  });
  // console.log(session);

  return {
    props: {
      user,
    },
  };
}
