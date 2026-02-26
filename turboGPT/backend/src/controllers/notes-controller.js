import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const uploadNotes = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    console.log("PDF received:", pdfPath);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(pdfPath));

    const backendUrl = process.env.PYTHON_API_URL || "https://blindfoldedly-calpacked-joslyn.ngrok-free.dev";

    const response = await axios.post(
      `${backendUrl}/process-pdf`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Notes upload error:", error.message);
    return res.status(500).json({ message: "PDF processing failed" });
  }
};
