/**
 * API endpoint to fetch the audio URL for a given episode.
 *
 * Body:
 * i)   Author - Author of the podcast
 * ii)  Title - Title of the episode
 * iii) Email - Email of the receipient
 */

import { sendConfirmationEmail } from "@/utils/email/ConfirmationEmailSender";

export default async function handler(req, res) {
  const showName = req.body.showName;
  const episodeName = req.body.episodeName;
  const userEmail = req.body.email;

  try {
    //send email
    const response = sendConfirmationEmail(
      userEmail,
      episodeName,
      showName,
      "google.com"
    );
    console.log(response);

    res.status(200);
    res.end(JSON.stringify(response));
  } catch (err) {
    console.error(err);
    res.status(400).end(JSON.stringify(err));
  }
}
