import Cap from "@cap.js/server";

export default async ({ req, res, log, error }) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  const cap = new Cap({
    tokens_store_path: ".data/tokensList.json",
  });

  if (req.method === "OPTIONS") {
    return res.json({}, 204, cors);
  }

  if (req.path === "/api/challenge") {
    log("Creating challenge");
    return res.json(cap.createChallenge({
      "challengeCount": 50,
      "challengeSize": 32,
      "challengeDifficulty": 4,
      "expiresMs": 30000000000
    }), 200, cors);
  }

  if (req.path === "/api/redeem") {
    const body = req.bodyJson;
    if (!body || !body.token || !body.solutions) {
      error("Invalid");
      return res.json({
        success: false,
        error: "Invalid",
      }, 400);
    }
    const { token, solutions } = body;
    const redeem = await cap.redeemChallenge({ token, solutions });
    log(redeem);
    return res.json(redeem, 200, cors);
  }

  error("Invalid path");
  return res.json({
    success: false,
    error: "Invalid",
  }, 404);
};
