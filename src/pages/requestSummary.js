import React from "react";
import Header from "@/components/Header";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import styles from "@/styles/RequestSummary.module.css";

const RequestSummary = ({ user }) => {
  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div>requestSummary</div>
    </div>
  );
};

RequestSummary.requireAuth = true;

export default RequestSummary;

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
