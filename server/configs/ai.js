import OpenAI from "openai";

const apiKey = process.env.GEMINI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL;
const model = process.env.OPENAI_MODEL;

if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY not found in environment variables');
    console.error('   Please add GEMINI_API_KEY to your .env file');
}

if (!baseURL) {
    console.warn('⚠️ Warning: OPENAI_BASE_URL not found, using default');
}

const ai = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
});

console.log('✅ Gemini AI client initialized');
console.log('   - Base URL:', baseURL);
console.log('   - API Key:', apiKey ? '***' + apiKey.slice(-4) : 'NOT SET');
console.log('   - Model:', model);

export default ai