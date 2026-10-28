import axios from "axios";

const preset_key = "download";
const cloud_name = "drcatqidu";

export const handleImage = async (
  e: React.ChangeEvent<HTMLInputElement>,
): Promise<string | undefined> => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset_key);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData,
      {
        // 💡 Remove explicit "Content-Type" so axios auto-generates the boundary
        withCredentials: false,
      },
    );

    // Return the secure URL so your component can use it
    return res.data.secure_url;
  } catch (err) {
    console.error("Image upload failed:", err);
    return undefined;
  }
};
