import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

import { generateRandomCode } from "@utils/generateRandom";

interface CreateQR30Props {
  accessToken: string;
  amount: string;
}

const applicationKey = process.env.SCB_API_KEY;

const CreateQR30 = async ({
  accessToken,
  amount
}: CreateQR30Props) => {
  try {

    const REF1 = generateRandomCode(9);
    const REF2 = generateRandomCode(9);

    const apiUrl = "https://api-sandbox.partners.scb/partners/sandbox/v1/payment/qrcode/create";

    // Define the request payload
    const payload = {
      "qrType": "PP",
      "ppType": "BILLERID",
      "ppId": "...",
      "amount": amount,
      "ref1": REF1,
      "ref2": REF2,
      "ref3": "QUEUETIX"
    };

    // Define the request headers
    const headers = {
      "Content-Type": "application/json",
      "authorization": `Bearer ${accessToken}`,
      "resourceOwnerId": applicationKey,
      "requestUId": uuidv4(),
      "accept-language": "TH",
    };


    // Make the HTTP POST request
    const response = await axios.post(apiUrl, payload, { headers });

    return {
      result: response.data,
      ref1: REF1,
      ref2: REF2
    };

  } catch (e) {
    return e.message;
  }
};

export default CreateQR30;