import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// homepage
app.get("/", (req, res) => {
    res.send("🚀 Solution K AI Server Running");
});

// AI endpoint
app.post("/study", async (req, res) => {
    const syllabus = req.body.syllabus;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Summarize syllabus and predict exam questions." },
            { role: "user", content: syllabus }
        ]
    });

    res.json({
        result: completion.choices[0].message.content
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Solution K running on port ${PORT}`);
});