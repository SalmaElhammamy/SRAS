import { POST } from "./services.js";

//TODO: remove this endpoint, testing purposes only
export const sendEmail = async (profile) => {
  return POST("/email/send-email", profile);
};
