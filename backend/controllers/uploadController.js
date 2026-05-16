import path from "path";

const SERVER_URL = process.env.SERVER_URL || "https://launch-ai.onrender.com";

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No image file was uploaded." });
  }

  const imageUrl = `${SERVER_URL}/uploads/${req.file.filename}`;
  return res.status(200).json({ success: true, imageUrl });
};
