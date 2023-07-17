/**
 * API endpoint to fetch the audio URL for a given episode.
 *
 * Body:
 * i)   Author - Author of the podcast
 * ii)  Title - Title of the episode
 * iii) Email - Email of the receipient
 */

import { sendConfirmationEmail } from "@/utils/email/ConfirmationEmailSender";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const showName = req.body.showName;
  const episodeName = req.body.episodeName;
  // const userEmail = req.body.email;

  try {
    const emails = await prisma.user.findMany({
      where: {
        request: {
          some: {
            podcast_hash: req.body.hash,
          },
        },
      },
      distinct: ["email"],
      select: {
        email: true,
      },
    });

    const emailList = emails.map((user) => user.email);

    console.log(emailList);

    emailList.forEach((email) => {
      sendConfirmationEmail(
        email,
        episodeName,
        showName,
        "podcrunch.co/library/hash"
      );
    });

    // const uniqueEmails = await prisma.user.findMany({
    //   where: {
    //     userUID: { in: userUIDs },
    //   },
    //   distinct: ["email"],
    //   select: {
    //     email: true,
    //   },
    // });

    // const emails = uniqueEmails.map((user) => user.email);
    // console.log(emails);

    // const emails = await
    // console.log(userUIDs);

    //send email
    // const response = sendConfirmationEmail(
    //   userEmail,
    //   episodeName,
    //   showName,
    //   "google.com"
    // );
    // console.log(response);

    res.status(200);
    res.end(JSON.stringify(emailList));
  } catch (err) {
    console.error(err);
    res.status(400).end(JSON.stringify(err));
  }
}
