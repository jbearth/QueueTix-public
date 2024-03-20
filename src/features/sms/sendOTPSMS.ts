// thirds-party
import { PublishCommand, CreateSMSSandboxPhoneNumberCommand } from "@aws-sdk/client-sns";

// project imports
import { snsClient } from "@constants/awsLib";
import { generateRandomCode, generateRandomNumber } from "@utils/generateRandom";

interface smsVerifyProps {
  phone: string;
  context?: any;
}

const topicArn = process.env.SNS_TOPIC_ARN;

const sendOTPSMS = async ({
  phone,
  context,
}: smsVerifyProps): Promise<string> => {

  try {

    // SNS.setSMSAttributes({
    //     attributes: { DefaultSMSType: "Transactional" }
    // },
    // function (error) {
    //     if (error) {
    //         console.log(error);
    //     }
    // });

    // const { mobileNo } = sms;

    //function to generate random number
    // const generateRandomNumber = (min: number, max: number) => {
    //   return Math.floor(Math.random() * (max - min) + min);
    // };

    // const generateReferenceCode = (length: number): string => {
    //   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    //   let refCode = "";

    //   for (let i = 0; i < length; i++) {
    //     refCode += characters[Math.floor(Math.random() * characters.length)];
    //   }

    //   return refCode;
    // };

    //function to send OTP using AWS-SNS
    const OTP = generateRandomNumber(100000, 999999);
    const Ref = generateRandomCode(6);

    const resCheckAlreadyPhoneNumber = await snsClient.send(
      new PublishCommand({
        PhoneNumber: phone, // *required
        Message: `Your OTP ${OTP} - Ref. ${Ref} (valid for 15 minutes)`, // *required
        Subject: "QueueTix"
      })
    );

    console.log(resCheckAlreadyPhoneNumber);


    return "sss";
    // return resCheckAlreadyPhoneNumber.MessageId;

  } catch (e) {
    return e.message;
  }
  // finally {
  //   await context.prisma.$disconnect();
  // }



};

export default sendOTPSMS;
