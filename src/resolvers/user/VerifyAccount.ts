import "reflect-metadata";
import { Arg, Ctx, Mutation } from "type-graphql";

// thirds-party
import {
  SubscribeCommand,
  CheckIfPhoneNumberIsOptedOutCommand,
  CreateSMSSandboxPhoneNumberCommand,
  VerifySMSSandboxPhoneNumberCommand
} from "@aws-sdk/client-sns";

// project imports
import { VerifyResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import sendOTPSMS from "@features/sms/sendOTPSMS";
import { snsClient } from "@constants/awsLib";

export class VerifyAccountResolver {
  @Mutation(() => VerifyResponse)
  async VerifyAccount(
    @Arg("email") email: string,
    @Arg("phone") phone: string,
    @Arg("isResend") isResend: boolean,
    @Ctx() context: MyContext
  ) {
    try {
      // const foundUser = await context.prisma.user.findUnique({
      // 	where: {
      // 		email,
      // 	},
      // });
      // if (!foundUser) {
      // 	return null;
      // }

      const phoneLocaleTH = `+66${phone.slice(1)}`;

      const resCheckAlreadyPhoneNumber = await snsClient.send( // resCheckAlreadyPhoneNumber.isOptedOut
        new CheckIfPhoneNumberIsOptedOutCommand({
          phoneNumber: phoneLocaleTH,
        })
      );


      if (resCheckAlreadyPhoneNumber.isOptedOut === true) {
        throw new Error("SMS messages cannot be sent to phone numbers that have opted out of receiving SMS");
      }

      if (isResend) {
        const result = sendOTPSMS({ phone: phoneLocaleTH, context });
        if (!result) {
          throw new Error("!Verify Account");
        }
        return {
          success: {
            message: "Verify Account Successfully"
          },
          data: result
        };
      }

      // const resCreateSMSSandboxPhoneNumber = await snsClient.send(
      //   new CreateSMSSandboxPhoneNumberCommand({
      //     PhoneNumber: phoneLocaleTH,
      //     LanguageCode: "en-US",
      //   })
      // );

      const resVerifySMSSandboxPhoneNumber = await snsClient.send(
        new VerifySMSSandboxPhoneNumberCommand({
          PhoneNumber: phoneLocaleTH, // required
          OneTimePassword: "133824", // required
        })
      );

      if (!resVerifySMSSandboxPhoneNumber) {
        throw new Error("Please verify again");
      }

      console.log("result: ", resVerifySMSSandboxPhoneNumber);


      // const resVerifyPhoneNumber = await snsClient.send(
      //   new SubscribeCommand({
      //     TopicArn: "arn:aws:sns:ap-southeast-2:275663223648:queuetixSMS", // *required
      //     Protocol: "sms", // *required
      //     Endpoint: phoneLocaleTH,
      //     ReturnSubscriptionArn: false, // or true
      //   })
      // );

      // const result = await sendOTPSMS({ phone: phoneLocaleTH, context });
      // if (!result) {
      //   throw new Error("!Verify Account");
      // }

      // console.log("result: ", resVerifyPhoneNumber);
      // console.log("result: ", resCreateSMSSandboxPhoneNumber);

      return {
        success: {
          message: "Verify Account Successfully"
        },
        data: "result"
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }
}  