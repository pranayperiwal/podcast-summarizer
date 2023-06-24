import React, { useState, useEffect } from "react";

import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { PrismaClient } from "@prisma/client";
import SpotifyLinkForm from "@/components/SpotifyLinkForm";
import { Divider } from "@mui/material";

const prisma = new PrismaClient();

const HomePage = ({ user }) => {
  console.log(user);
  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div className={styles.contentContainer}>
        <div className={styles.contentHeader}>
          Enter the spotify link of the podcast you would like to summarise
        </div>
        <Divider />
        <SpotifyLinkForm />
      </div>
    </div>
  );
};

HomePage.requireAuth = true;

export default HomePage;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
