// Mock AI Controller for Testing
// Replace the content in server/controllers/aiController.js with this for testing

import Resume from "../models/Resume.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Mock enhanced content for testing
    const mockEnhancedContent = `Experienced professional with strong expertise in ${userContent.toLowerCase()}. Proven track record of delivering exceptional results and driving innovation. Committed to continuous learning and professional growth.`;

    return res.status(200).json({ enhancedContent: mockEnhancedContent });
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    return res.status(500).json({ message: error.message || "AI service unavailable" });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Mock enhanced job description
    const mockEnhancedContent = `• ${userContent}\n• Collaborated with cross-functional teams to achieve project objectives\n• Implemented innovative solutions resulting in improved efficiency\n• Maintained high standards of quality and attention to detail`;

    return res.status(200).json({ enhancedContent: mockEnhancedContent });
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    return res.status(500).json({ message: error.message || "AI service unavailable" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Mock resume data extraction
    const mockResumeData = {
      professional_summary: "Experienced professional seeking new opportunities",
      skills: ["JavaScript", "React", "Node.js", "MongoDB"],
      personal_info: {
        image: "",
        full_name: "John Doe",
        profession: "Software Developer",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        location: "New York, NY",
        linkedin: "https://linkedin.com/in/johndoe",
        website: "https://johndoe.com"
      },
      experience: [
        {
          company: "Tech Company",
          position: "Software Developer",
          start_date: "2022-01",
          end_date: "2024-01",
          description: "Developed and maintained web applications using modern technologies",
          is_current: false
        }
      ],
      projects: [
        {
          name: "Sample Project",
          type: "Web Application",
          description: "A full-stack web application built with React and Node.js"
        }
      ],
      education: [
        {
          institution: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science",
          graduation_date: "2021-05",
          gpa: "3.8"
        }
      ]
    };

    const newResume = await Resume.create({ userId, title, ...mockResumeData });

    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
