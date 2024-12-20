import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const REGION = "us-east-1"; // e.g., 'us-east-1'
const BUCKET_NAME = "e-kicker";

// Configure S3 Client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: "AKIAR7HWYIR5ZC62I3EG",
    secretAccessKey: "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",
  },
});

export const uploadFileToS3 = async (file, folder = "uploads") => {
  const fileName = `${folder}/${Date.now()}_${file.name}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (err) {
    console.error("Error uploading file to S3:", err);
    throw err;
  }
};
