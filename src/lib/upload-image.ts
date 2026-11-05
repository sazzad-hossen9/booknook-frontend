/**
 * Uploads an image file to ImgBB and returns the hosted image URL.
 */
export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing in .env");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data?.data?.url) {
    throw new Error(data?.error?.message || "Failed to upload image");
  }

  return data.data.url;
}
