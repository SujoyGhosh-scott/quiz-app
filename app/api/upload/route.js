import { cloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

const uploadToCloudinary = (fileUri, fileName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "product-images", // any sub-folder name in your cloud
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

export async function POST(req) {
  // your auth check here if required

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const fileBuffer = await file.arrayBuffer();

    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // this will be used to upload the file
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const res = await uploadToCloudinary(fileUri, file.name);

    if (res.success && res.result) {
      return NextResponse.json({
        success: true,
        imgUrl: res.result,
      });
    } else return NextResponse.json({ success: false });
  } catch (error) {
    console.log("image upload error: ", error);
    return NextResponse.json({
      success: false,
      error,
    });
  }
}
