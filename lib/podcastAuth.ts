import crypto from "node:crypto";
import { USER_AGENT } from "./api";

export function podcastHeaders(key: string, secret: string) {
  const apiHeaderTime = Math.floor(Date.now() / 1000).toString();
  const hash = crypto.createHash("sha1").update(key + secret + apiHeaderTime).digest("hex");

  return {
    "X-Auth-Key": key,
    "X-Auth-Date": apiHeaderTime,
    Authorization: hash,
    "User-Agent": USER_AGENT
  };
}
