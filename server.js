import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
    res.send("🚀 Solution K backend running");
});

app.post("/study", async (req, res) => {
    try {
        const { syllabus } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-pro"
        });

        const prompt = `
You are an AI study assistant.

Convert this syllabus into:

1. Easy explanation
2. Key concepts
3. Revision notes
4. Important exam questions

Syllabus:
${syllabus}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        res.json({ result: text });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "AI processing failed" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Solution K backend running");
});