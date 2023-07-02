// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const uid = req.body.uid;
  const valueAdded = req.body.valueAdded;

  try {
    //increase credits
    const updateUser = await prisma.user.update({
      where: {
        user_id: uid,
      },
      data: {
        credits: {
          increment: valueAdded,
        },
      },
    });

    console.log(updateUser);

    res.status(200);
    res.end(JSON.stringify(updateUser));
  } catch (err) {
    console.error(err);
    res.status(400).end(JSON.stringify(err));
  }
}
