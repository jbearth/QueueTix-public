import "reflect-metadata";
import { Arg, Ctx, Query, Mutation } from "type-graphql";

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { QRCodeResponse } from "@utils/myresponse";
import OAuthToken from "@features/payment/OAuthToken";
import CreateQR30 from "@features/payment/CreateQR30";
import VerifyTransactionSlip from "@features/payment/VerifyTransactionSlip";

export class QRCodePayment {

  @Query(() => QRCodeResponse)
  async GetQRCode30(
    @Arg("Amount") amount: string,
    @Ctx() context: MyContext,

  ) {
    try {

      // ขอ Token ในการใช้ API SCB
      const resOAuthToken = await OAuthToken(context);

      // สร้าง QRCode-30
      const resCreateQR30 = await CreateQR30({
        accessToken: resOAuthToken,
        amount
      });

      if (resCreateQR30.result.status.code !== 1000) {
        throw new Error(resCreateQR30.result.status.description);
      }

      // console.log("res: ", resCreateQR30);

      return {
        success: {
          message: resCreateQR30.result.status.description
        },
        data: {
          result: resCreateQR30.result.data.qrRawData,
          ref1: resCreateQR30.ref1,
          ref2: resCreateQR30.ref2
        }
      };
    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Mutation(() => QRCodeResponse)
  async VerifyQRCodePayment(
    @Arg("REF1") ref1: string,
    @Arg("REF2") ref2: string,
    @Ctx() context: MyContext,
  ) {
    try {

      const eventData: any = context.eventData;
      console.log("e: ", eventData);
      console.log("REF111: ", ref1);
      console.log("REF222: ", ref2);
      console.log("check: ", eventData?.billPaymentRef1 == ref1);
      if ((ref1 && ref2) != "" && eventData?.billPaymentRef1 == ref1 && eventData?.billPaymentRef2 == ref2) {
        const resOAuthToken = await OAuthToken(context);

        // ตรวจสอบ slip โอนเงิน
        const resVerifytansSlip = await VerifyTransactionSlip({
          accessToken: resOAuthToken,
          context
        });

        if (resVerifytansSlip.status.code !== 1000) {
          throw new Error(resVerifytansSlip.status.description);
        }
        // context.eventData = {};
        // console.log("eventData:", context.eventData);
        // console.log("res:", resVerifytansSlip);

        return {
          success: {
            message: resVerifytansSlip.status.description,
          },
          data: {
            result: String(resVerifytansSlip.status.code)
          }
        };
      } else if (!eventData || !ref1 || !ref2 || (eventData?.billPaymentRef1 == ref1) == false || (eventData?.billPaymentRef2 == ref2) == false) {
        return {
          error: {
            message: "Not found data ID Slip Verification",
          },
          data: {
            result: "0000"
          }
        };
      }

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

}