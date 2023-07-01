import React, { useState, useEffect } from "react";

import styles from "@/styles/Home.module.css";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Header from "@/components/Header";
import { Divider } from "@mui/material";

const OrderPage = ({ user }) => {
  // console.log(user);
  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div className={styles.contentContainer}>
        <div className={styles.contentHeader}>
            Here is your order summary:
        </div>
        <Divider />
    </div>
    </div>
  );
};

OrderPage.requireAuth = true;

export default OrderPage;

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
      email: session.user.email,
    },
  });

  return {
    props: {
      user,
    },
  };
}
