import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

// VERY IMPORTANT FOR VERCEL
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// health check route
app.get("/", (req, res) => {
    res.send("🚀 Solution K Backend Running");
});

// MAIN AI ENDPOINT
app.post("/study", async (req, res) => {

    try {

        const { syllabus } = req.body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an AI study assistant. Summarize the syllabus, generate revision notes and predict exam questions."
                },
                {
                    role: "user",
                    content: syllabus
                }
            ]
        });

        res.json({
            result: completion.choices[0].message.content
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "AI processing failed"
        });

    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Solution K backend running on port ${PORT}`);
});