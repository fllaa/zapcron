import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

class S3 {
  client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: File) {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: file.name,
      Body: fileBuffer,
      ContentType: file.type,
    });
    try {
      await this.client.send(command);
      return {
        url: `${process.env.S3_PUBLIC_URL}/${file.name}`,
      };
    } catch (error) {
      console.error("Error uploading file", error);
      throw new Error("Error uploading file");
    }
  }
}

export const s3 = new S3();
