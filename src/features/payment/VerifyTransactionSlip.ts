
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";

interface VerifyTransactionProps {
  accessToken: string;
  context: any;
}

const applicationKey = process.env.SCB_API_KEY;

const VerifyTransactionSlip = async ({
  accessToken,
  context
}: VerifyTransactionProps) => {
  try {

    console.log("Verifyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    console.log("eventData222: ", context.eventData);

    // Define the transaction reference and sending bank
    const transRef = context.eventData.transactionId;
    // const transRef = "2023100384L6abAXLaZPTq9";
    const sendingBank = "014";



    // Define the API endpoint URL
    const apiUrl = `https://api-sandbox.partners.scb/partners/sandbox/v1/payment/billpayment/transactions/${transRef}?sendingBank=${sendingBank}`;

    // Define request headers
    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "requestUID": uuidv4(),
      "resourceOwnerID": applicationKey,
      "accept-language": "TH",
    };

    // Make the HTTP POST request
    const response = await axios.get(apiUrl, { headers });

    console.log("responseVerify: ", response.data);

    return response.data;

  } catch (e) {
    return e.message;
  }
};

export default VerifyTransactionSlip;