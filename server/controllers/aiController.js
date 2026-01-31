// controller for enhancing a resume's professional summary 
// POST: /api/ai/enhance-pro-sum

import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

function getAiErrorPayload(error) {
  const status = error?.status || error?.response?.status || 500;
  const providerPayload = error?.response?.data || error?.error || null;
  const message = error?.message || "AI service unavailable";
  return { status, message, providerPayload };
}

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key not configured. Please add GEMINI_API_KEY to .env file" });
    }

    let response;
    try {
      response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-1.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1–2 sentences, highlighting key skills, experience, and career objectives. Make it compelling, ATS-friendly, and return only the improved text.",
          },
          {
            role: "user",
            content: userContent,
          },
        ],
      });
    } catch (error) {
      const { status, message, providerPayload } = getAiErrorPayload(error);
      console.error("AI Enhancement Error (pro-sum):", { status, message, providerPayload });
      return res.status(status).json({ message, providerPayload });
    }

    const enhancedContent = response?.choices?.[0]?.message?.content;
    if (!enhancedContent) {
      return res.status(502).json({ message: "AI did not return any content" });
    }
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    const { status, message, providerPayload } = getAiErrorPayload(error);
    console.error("AI Enhancement Error (pro-sum):", { status, message, providerPayload });
    return res.status(status).json({ message, providerPayload });
  }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key not configured. Please add GEMINI_API_KEY to .env file" });
    }

    let response;
    try {
      response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-1.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in resume writing. Your task is to enhance the job description section of a resume. Make each point action-oriented, impactful, and ATS-optimized using strong verbs and quantifiable achievements. Return only the improved text.",
          },
          {
            role: "user",
            content: userContent,
          },
        ],
      });
    } catch (error) {
      const { status, message, providerPayload } = getAiErrorPayload(error);
      console.error("AI Enhancement Error (job-desc):", { status, message, providerPayload });
      return res.status(status).json({ message, providerPayload });
    }

    const enhancedContent = response?.choices?.[0]?.message?.content;
    if (!enhancedContent) {
      return res.status(502).json({ message: "AI did not return any content" });
    }
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    const { status, message, providerPayload } = getAiErrorPayload(error);
    console.error("AI Enhancement Error (job-desc):", { status, message, providerPayload });
    return res.status(status).json({ message, providerPayload });
  }
};

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    console.log('Upload resume request received:', { 
      userId, 
      title, 
      resumeTextLength: resumeText?.length 
    });

    if (!resumeText || !title) {
      console.error('Upload resume validation failed:', { resumeText: !!resumeText, title: !!title });
      return res.status(400).json({ message: "Missing required fields: resumeText or title" });
    }

    if (resumeText.length < 50) {
      console.error('Resume text too short:', resumeText.length);
      return res.status(400).json({ message: "Resume text is too short. Please upload a valid resume." });
    }

    const systemPrompt = "You are an expert AI agent that extracts structured data from resumes.";

    const userPrompt = `
    Extract data from this resume text and return it as a pure JSON object in the following format:
    {
      "professional_summary": "",
      "skills": [],
      "personal_info": {
        "image": "",
        "full_name": "",
        "profession": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": ""
      },
      "experience": [
        {
          "company": "",
          "position": "",
          "start_date": "",
          "end_date": "",
          "description": "",
          "is_current": false
        }
      ],
      "projects": [
        {
          "name": "",
          "type": "",
          "description": ""
        }
      ],
      "education": [
        {
          "institution": "",
          "degree": "",
          "field": "",
          "graduation_date": "",
          "gpa": ""
        }
      ]
    }

    Resume text:
    ${resumeText}
    `;

    console.log('Calling AI API with model:', process.env.OPENAI_MODEL);

    let response;
    try {
      response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      });
    } catch (aiError) {
      console.error('AI API Error:', aiError.message);
      console.error('AI Error details:', aiError.response?.data || aiError);
      return res.status(400).json({ 
        message: `AI service error: ${aiError.message}. Please check your API key and model configuration.` 
      });
    }

    if (!response?.choices?.[0]?.message?.content) {
      console.error('No content in AI response:', response);
      return res.status(400).json({ message: 'AI did not return valid content' });
    }

    const extractedData = response.choices[0].message.content;
    console.log('AI extraction successful, parsing JSON...');

    let parsedData;
    try {
      parsedData = JSON.parse(extractedData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      console.error('Raw AI response:', extractedData);
      return res.status(400).json({ message: 'Failed to parse AI response. Please try again.' });
    }

    console.log('Creating resume in database...');
    const newResume = await Resume.create({ userId, title, ...parsedData });

    console.log('Resume uploaded successfully:', newResume._id);
    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    console.error('Upload resume error:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    return res.status(400).json({ message: error.message || 'Failed to process resume' });
  }
};
