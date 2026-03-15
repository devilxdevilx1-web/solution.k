import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
    res.send("🚀 Solution K AI Server Running (Gemini)");
});

app.post("/study", async (req, res) => {

    try {

        const { syllabus } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const result = await model.generateContent(
            `You are an AI study assistant. Summarize this syllabus, create revision notes and exam preparation questions.

      ${syllabus}`
        );

        const response = result.response.text();

        res.json({
            result: response
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "AI processing failed"
        });

    }

});

app.listen(3000, () => {
    console.log("🚀 Solution K backend running with Gemini");
});