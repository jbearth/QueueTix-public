// import AWS from "aws-sdk";

// import "reflect-metadata";
// import { Arg, Ctx, Mutation } from "type-graphql";

// // project imports
// import { UploadResponse } from "@utils/myresponse";
// import { MyContext } from "@resolvers/types/MyContext";
// import { ImageUploadInput } from "./ImageUploadInput";

// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
// const region = process.env.S3_REGION;
// const bucket = process.env.S3_BUCKET;

// export class UploadFileResolver {
//   @Mutation(() => UploadResponse)
//   async UploadFile(
//     @Arg("image") image: ImageUploadInput,
//     @Ctx() context: MyContext,
//   ) {

//     try {
//       console.log(region);
//       AWS.config.logger = console;
//       AWS.config.update({ region: region });

//       const s3 = new AWS.S3(
//         {
//           credentials: {
//             accessKeyId: accessKeyId,
//             secretAccessKey: secretAccessKey,
//           }
//         }
//       );

//       const { filename, mimeType, data, email } = image;

//       const currentTime = new Date().getTime();

//       // Decode base64 data
//       const imageBuffer = Buffer.from(data, "base64");

//       const dataAWS = {
//         Key: `${currentTime}_${filename}`,
//         Body: imageBuffer,
//         ContentType: mimeType,
//         Bucket: bucket,
//         ACL: "public-read"
//       };

//       let url;
//       let updateProfilePicture;

//       s3.putObject(dataAWS, function (err, data) {
//         if (err) {
//           console.log("Error: ", err);
//           throw new Error();
//         } else if (data) {
//           url = `https://queuetix.s3.ap-southeast-2.amazonaws.com/${filename}_${currentTime}`;
//           updateProfilePicture = context.prisma.profile.updateMany({
//             where: {
//               user: {
//                 email: email,
//               }
//             },
//             data: {
//               profilePicture: "ss"
//             },
//           });
//         }
//       });

//       if (!updateProfilePicture) {
//         throw new Error("");
//       }

//       return {
//         success: {
//           message: `Successfully uploaded a picture of ${filename}`,
//         },
//         url
//       };

//     } catch (e) {
//       return {
//         error: {
//           message: e.message,
//         },
//       };
//     } finally {
//       await context.prisma.$disconnect();
//     }
//   }
// }