/* eslint-disable @typescript-eslint/no-empty-function */
import formidable from "formidable";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { Transform } from "stream";
import { IncomingMessage } from "http";

const accessKeyId = process.env.AWS_QUEUETIX_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_QUEUETIX_SECRET_ACCESS_KEY;
const region = process.env.S3_QUEUETIX_REGION;
const Bucket = process.env.S3_QUEUETIX_BUCKET;

const parsefile = async (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    const options = {
      maxFileSize: 100 * 1024 * 1024, //100 megabytes converted to bytes,
      allowEmptyFiles: false
    };

    const form = formidable(options);
    // method accepts the request and a callback.
    form.parse(req, (err: unknown, fields: unknown, files: unknown) => {
      // console.log(fields, "====", files)
    });

    form.on("error", (error: { message: unknown; }) => {
      reject(error.message);
    });

    form.on("data", (data: { name: string; value: unknown; }) => {
      if (data.name === "complete") {
        // let statuscode = data.value['$metadata']?.httpStatusCode || 200;
        resolve(data.value);
      }
    });

    form.on("fileBegin", (formName, file: any) => {

      file.open = async function () {
        this._writeStream = new Transform({
          transform(chunk: unknown, encoding: unknown, callback: (_arg0: null, _arg1: unknown) => void) {
            callback(null, chunk);
          }
        });

        this._writeStream.on("error", (e: any) => {
          return form.emit("error", e);
        });

        // upload to S3
        new Upload({
          client: new S3Client({
            credentials: {
              accessKeyId,
              secretAccessKey
            },
            region
          }),
          params: {
            ACL: "public-read",
            Bucket,
            Key: `${Date.now().toString()}-${this.originalFilename}`,
            Body: this._writeStream
          },
          tags: [], // optional tags
          queueSize: 4, // optional concurrency configuration
          partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
          leavePartsOnError: false, // optional manually handle dropped parts
        })
          .done()
          .then((data: unknown) => {
            form.emit("data", { name: "complete", value: data });
          }).catch((err: unknown) => {
            form.emit("error", err);
          });
      };

      file.end = function (cb) {
        this._writeStream.on("finish", () => {
          this.emit("end");
          cb();
        });
        this._writeStream.end();
      };
    });
  });
};

export default parsefile;