import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

export const getUser = async () => {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  console.log("Current user:", user);
  return user;
};
