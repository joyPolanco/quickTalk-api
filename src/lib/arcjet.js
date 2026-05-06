

import arcjet, {
  detectBot,
  shield,
  slidingWindow,
  tokenBucket,
} from "@arcjet/node";
import { ARCJET_KEY } from "../../config/env.js";
import {  ARCJET_MODE } from "../../config/env.js";


const arcjet_mode =  ARCJET_MODE ?? "LIVE";
const MAX_REQUESTS_HTTP = 50;

export const httpArcjet = arcjet({
  key: ARCJET_KEY, // Get your site key from https://app.arcjet.com
  rules: [
    shield({ mode: arcjet_mode }),
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
      ],
    }),
     slidingWindow({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      windowSize: 60, // 1 minute
      max: 100, 
      interval:60// Max 100 requests per window per IP

    }),
    tokenBucket({
      mode: ARCJET_MODE,
      

      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});


export default httpArcjet;