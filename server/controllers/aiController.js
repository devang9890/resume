

// controller for enhancing a resumes professional summary 
// post : /api/ai/enhance-pro-sum

import ai from "../configs/ai";

export const enhanceProfessionalSummary = async(req , res) =>{
    try{
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message: "Missing required fields"})

        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
        { role: "system", content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume . the summary should be 1-2 sentences also highlighting key skills , experience and carrer objectives . Make it compelling and ATS-friendlu and only return text no options or anything else" },
        {
            role: "user",
            content: "Explain to me how AI works",
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch(error){
        return res.status(400).json({message:error.message})

    }
}

// controller for enhancing a resume's job description
// post : /api/ai/enhance-job-desc

export const enhanceJobDescription = async(req , res) =>{
    try{
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message: "Missing required fields"})

        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
        { role: "system",
             content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume . the summary should be 1-2 sentences also highlighting key skills , experience and carrer objectives . Make it compelling and ATS-friendlu and only return text no options or anything else" },
        {
            role: "user",
            content: "userContent",
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch(error){
        return res.status(400).json({message:error.message})

    }
}
