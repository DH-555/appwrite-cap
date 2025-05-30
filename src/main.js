import Cap from "@cap.js/server";

export default async ({ req, res, log, error }) => {
  const cap = new Cap({
    tokens_store_path: ".data/tokensList.json",
  });

  if (req.path === "/api/challenge") {
    log("Creating challenge");
    const challenge = cap.createChallenge({
      "challengeCount": 50,
      "challengeSize": 32,
      "challengeDifficulty": 4,
      "expiresMs": 300000
    })
    log(challenge);
    return res.json(challenge);
  }

  if (req.path === "/api/reedem") {
    const { token, solutions } = req.bodyJSON;
    if (!token || !solutions) {
      error("Invalid");
      return res.status(400).json({ success: false });
    }
    res.json(await cap.redeemChallenge({ token, solutions }));
  }

  error("Invalid path");
  return res.json({
    success: false,
    error: "Invalid",
  });
};
