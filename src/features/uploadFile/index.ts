import AWS from "aws-sdk";

import "reflect-metadata";

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { ImageUploadInput } from "./ImageUploadInput";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = "";
const bucket = "";

interface UploadFileProps {
  image: ImageUploadInput;
  context?: MyContext;
}

const UploadFile = async ({
  image,
  context,
}: UploadFileProps): Promise<string> => {

  try {

    AWS.config.logger = console;
    AWS.config.update({
      apiVersion: "2006-03-01",
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      }
    });

    const s3 = new AWS.S3();

    const { filename, mimeType, data } = image;

    const currentTime = new Date().getTime();

    // Decode base64 data
    const imageBuffer = Buffer.from(data, "base64");
    console.log("Image Buffer Size:", imageBuffer.length); // Log buffer size

    const dataAWS = {
      Key: `${currentTime}_${filename}`,
      Body: imageBuffer,
      ContentType: mimeType,
      Bucket: bucket,
      ACL: "public-read"
    };

    const url = `https://queuetix.s3.ap-southeast-2.amazonaws.com/${currentTime}_${filename}`;
    console.log(dataAWS);
    const uploadObject = () => {
      return new Promise((resolve) => {
        s3.putObject(dataAWS, function (err, data) {
          if (err) {
            throw new Error(err.message);
          } else if (data) {
            resolve(url);
          }
        });
      });
    };

    const uploadResult = await uploadObject();
    return String(uploadResult);

  } catch (e) {
    return e;
  } finally {
    await context.prisma.$disconnect();
  }



};

export default UploadFile;
