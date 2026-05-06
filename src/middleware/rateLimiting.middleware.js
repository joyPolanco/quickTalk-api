import httpArcjet from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const RateProtection = async (req, res, next) => {
  try {
    const decision = await httpArcjet.protect(req);

    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Demasiadas solicitudes - Rate limit exceeded" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Forbidden - Bot detectado" });
      }
      return res.status(403).json({ message: "Forbidden - Accesso denegado" });
    }

    // check sppofing

    if (
      decision.results.some((result) => result.isBot() && isSpoofedBot(result))
    ) {
      console.log(
        "Spoofed bot detected:",
        decision.results.filter(
          (result) => result.isBot() && isSpoofedBot(result),
        ),
      );
    }
    next();
  } catch (error) {
    console.log("Error in RateProtection middleware", error);
    next();
  }
};
