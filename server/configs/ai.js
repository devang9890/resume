import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.OpenAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || process.env.OpenAI_BASE_URL,
});

export default ai