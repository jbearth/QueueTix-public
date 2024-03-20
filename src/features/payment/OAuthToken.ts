
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

import { MyContext } from "@resolvers/types/MyContext";

const applicationKey = process.env.SCB_API_KEY;
const applicationSecret = process.env.SCB_API_SCRET_KEY;

const OAuthToken = async (context: MyContext) => {
  try {

    const uuidV4 = uuidv4();

    const url = "https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token";

    // Define the request payload
    const payload = {
      "applicationKey": applicationKey,
      "applicationSecret": applicationSecret
    };


    // Define the request headers
    const headers = {
      "content-type": "application/json",
      "resourceOwnerId": applicationKey,
      "requestUId": uuidV4,
      "accept-language": "TH",
    };

    const isTokenExpired = (expiresAt: number): boolean => {
      if (expiresAt === 0) return true;
      const currentTimestamp = Math.floor(Date.now() / 1000); // เวลาปัจจุบันเป็นวินาที
      // console.log("currentTimestamp: ", currentTimestamp);

      // เปรียบเทียบเวลาปัจจุบันกับเวลาหมดอายุ
      return currentTimestamp >= expiresAt ? true : false;
    };

    let responseToken;
    const resGetMyTokenSCB = JSON.parse(await context.redis.get("myOAuthToken"));
    // หาวันหมดอายุของ token SCB  ถ้า resGetMyTokenSCB ไม่มีข้อมูล ให้ส่งค่า 0 ไป
    const isExpired = isTokenExpired(resGetMyTokenSCB?.expiresAt || 0);
    console.log("resTokenSCB: ", resGetMyTokenSCB);
    console.log("isExpired: ", isExpired);

    // ถ้าไม่มีข้อมูลที่ชื่อ "myOAuthToken" ใน redis
    if (!resGetMyTokenSCB || (resGetMyTokenSCB && isExpired)) {
      // ขอ Token ในการใช้ API SCB
      await axios.post(url, payload, { headers })
        .then(async (response) => {
          console.log("Response:", response.data.data);
          // เก็บ token ไว้ใน redis
          await context.redis.set("myOAuthToken", JSON.stringify(response.data.data));
          responseToken = response.data.data.accessToken;
        })
        .catch((error) => {
          console.error("Error:", error);
          throw new Error(error);
        });
      return responseToken;
    }
    return resGetMyTokenSCB.accessToken;

  } catch (e) {
    return e.message;
  }
};

export default OAuthToken;