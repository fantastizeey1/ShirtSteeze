import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E ROUTES" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("Received prompt:", prompt);

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    console.log("Response from OpenAI:", response.data);

    if (!response.data || !response.data.data || !response.data.data.length) {
      throw new Error("No data received from OpenAI");
    }

    const image = response.data.data[0].b64_json;

    if (!image) {
      throw new Error("Failed to generate image");
    }

    console.log("Generated image:", image);

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error("Error generating image:", error.message); // Log only the error message
    if (error.response) {
      console.error("Status code:", error.response.status);
      console.error("Response data:", error.response.data);
      if (error.response.data.error.code === "billing_hard_limit_reached") {
        res
          .status(403)
          .json({
            message:
              "Billing limit reached. Please upgrade your plan or check your billing details.",
          });
        return;
      }
    }
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

export default router;
