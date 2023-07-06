import React from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Header from "@/components/Header";
import styles from "@/styles/SummaryIndividual.module.css";
import SummaryEpisodeDetails from "@/components/summaries/SummaryEpisodeDetails";
import ChaptersContainer from "@/components/summaries/ChaptersContainer";

const SummaryIndividualPage = ({ user }) => {
  const dummyData = {
    podcast_name:
      "E259: The Brain Coach To The World's Top Leaders & Billionaires! 10 Steps To Never Forget Anything Ever Again!: Jim Kwik",
    show_name: "The Diary Of A CEO with Steven Bartlett",
    duration: 5957845,
    date: new Date(),
    image: "https://i.scdn.co/image/ab67656300005f1fad0859815f1f10d17029070c",
    chapters: [
      {
        summary:
          "Listen for free to HPR on strategy wherever you get your podcasts. Jill Avery and Rachel Greenwald talk about building your personal brand. Shouldn't you spend a little more time thinking about and selling the brand that is you?",
        title: "The HBR Idea: Building Your Personal Brand",
        start: 650,
        end: 145740,
      },
      {
        summary:
          "An academic and a matchmaker come together to give personal branding a makeover. Jill: Most people are hesitant about personal branding. People often feel overwhelmed by the need to have a personal brand that's carefully and intentionally shepherded. Personal branding is about showing your authentic self.",
        title: "The Importance of Personal Branding",
        start: 148190,
        end: 472770,
      },
      {
        summary:
          "There are similarities between developing your personal brand in your social life and your professional life. First impressions always matter. Your personal brand encompasses both your professional and personal identities. Managing it requires managing across all of those different realms.",
        title: "Developing a Personal Brand in the Workworld",
        start: 472920,
        end: 978930,
      },
      {
        summary:
          "The visioning exercise makes you spend the time reflecting on the decisions you've made. It gives you a chance to reevaluate aligning your authentic traits with what the metrics are for success in the audiences that you're trying to impress. Join HubSpot at their annual Inbound conference in Boston on September 5 through 8th.",
        title: "Inbound Conference 2019: A Personal Pivot",
        start: 979090,
        end: 1186200,
      },
      {
        summary:
          "Your brand really is how other people perceive you. Personal branding is always reliant on other people's responses to you. How do you get that feedback from other people?",
        title: "The Importance of Personal Branding",
        start: 1187690,
        end: 1617620,
      },
      {
        summary:
          "Building a personal brand that is authentically you is so important. The most important rule of personal branding is to celebrate what you are. Find stories that are authentic, but without feeling like you're bragging about yourself. How do managers encourage their employees to engage in their own personal branding efforts?",
        title: "The Secret to Personal Brand",
        start: 1618310,
        end: 2001182,
      },
      {
        summary:
          "HBS lecturer and researcher Jill Avery and professional matchmaker Rachel Greenwald talk about A New Approach to Building Your Personal Brand. Find more episodes and more podcasts to help you manage your team, your organization, and your career.",
        title: "HBR IdeaCast: Building Your Personal Brand",
        start: 2001316,
        end: 2052380,
      },
    ],
  };

  const { chapters, ...podcast_details } = dummyData;

  return (
    <div className={styles.container}>
      <Header loggedIn={true} credits={user.credits} />
      <div className={styles.contentContainer}>
        <h2>Summary</h2>
        <SummaryEpisodeDetails data={podcast_details} />
        <ChaptersContainer chapters={chapters} />
      </div>
    </div>
  );
};

export default SummaryIndividualPage;

SummaryIndividualPage.requireAuth = true;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  //1. check if session exists
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  //2. check if the user has access to the requested podcast (this also ends up checking if podcast exists)
  // const userRequest = await prisma.request.findFirst({
  //   where: {
  //     userId: session.user.uid,
  //     podcast_hash: context.query.hash,
  //   },
  // });
  // // console.log(userRequest);
  // if (!userRequest) {
  //   return {
  //     redirect: {
  //       destination: "/home",
  //       permanent: false,
  //     },
  //   };
  // }

  const user = await prisma.user.findUnique({
    where: {
      user_id: session.user.uid,
    },
  });

  return {
    props: {
      user,
      // request: JSON.parse(JSON.stringify(userRequest)),
    },
  };
}
