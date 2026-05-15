import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSession } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Using 4MB as a safer default for the free plan
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Ensure session exists
      const session = await getSession();
      
      if (!session) {
        throw new Error("Unauthorized");
      }
      
      // Return metadata to be used in onUploadComplete
      return { userId: (session.user as any).id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
