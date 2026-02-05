import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { runAgent } from "../agent/agent.js";

const router = express.Router();

router.post("/command", protect, async (req, res) => {
  
  if (process.env.AGENT_ENABLED !== "true") {
    return res.status(404).json({ message: "Not found" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    const result = await runAgent({
      message: req.body.message,
      token,
    });

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
