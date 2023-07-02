import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { data, creditsRequired } = req.body;

  try {
    //check if the request hasnt been made previously, if it has, raise error
    const prevRequestMadeResponse = await prisma.request.findMany({
      where: {
        hash: data.hash,
        userId: data.userId,
      },
    });

    // console.log(prevRequestMadeResponse);

    if (prevRequestMadeResponse.length) {
      throw new Error("Request made earlier");
    }

    //check if enough credits
    const { credits } = await prisma.user.findUnique({
      where: {
        user_id: data.userId,
      },
      select: {
        credits: true,
      },
    });

    if (credits < creditsRequired) {
      throw new Error("Not enough credits");
    }

    //make request
    const requestCreatedResponse = await prisma.request.create({ data });
    console.log("request record created");
    // console.log(response);

    //reduce credits
    const updateUser = await prisma.user.update({
      where: {
        user_id: data.userId,
      },
      data: {
        credits: credits - creditsRequired,
      },
    });

    //store in CreditsSpent table
    const credtsSpentResponse = await prisma.creditsSpent.create({
      data: {
        userId: data.userId,
        date: new Date(),
        quantity: creditsRequired,
        request_id: requestCreatedResponse.id,
      },
    });

    // console.log("Credits left: ", updateUser.credits);

    res.status(200);
    res.end(JSON.stringify(requestCreatedResponse));
  } catch (err) {
    console.error(err);

    if (err.message === "Request made earlier") {
      res.status(444).send("Not enough credits");
      //   res.status(444).end(JSON.stringify(err));
    } else if (err.message === "Not enough credits") {
      res.status(445).end(JSON.stringify(err));
    } else {
      res.status(400).end(JSON.stringify(err));
    }
    // res.json(err);
  }
}
