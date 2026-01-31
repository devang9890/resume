import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs'

// controller for creating a new resume
// post : /api/resumes/create
export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        if(!title){
            return res.status(400).json({ message: 'Title is required' })
        }

        //create new resume
        const newResume = await Resume.create({ userId, title })
        // return success message
        return res.status(201).json({ message: 'Resume created successfully', resume: newResume })

    } catch (error) {
        console.error("Create resume error:", error);
        return res.status(400).json({ message: error.message })
    }
}

// controller for deleting a resume
// delete: /api/resumes/delete
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ userId, _id: resumeId })
        // return success message 
        return res.status(200).json({ message: 'Resume deleted successfully' })

    } catch (error) {
        console.error("Delete resume error:", error);
        return res.status(400).json({ message: error.message })
    }
}

// get user resume by id 
// get : /api/resumes/get
export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        return res.status(200).json({ resume })

    } catch (error) {
        console.error("Get resume error:", error);
        return res.status(400).json({ message: error.message })
    }
}

// get resume by id public 
// get /api/resumes/public
export const getPublicResumeyId = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found or not public" })
        }
        return res.status(200).json({ resume })
    }
    catch (error) {
        console.error("Get public resume error:", error);
        return res.status(400).json({ message: error.message })

    }
}


// controller for updating a resume
// put : /apuo/resumes/update
export const updatedResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body
        const image = req.file;

        let resumeDataCopy;
        if(typeof resumeData === 'string'){
            resumeDataCopy = JSON.parse(resumeData)
        } else{
            resumeDataCopy = structuredClone(resumeData)
        }
        
        if (image) {

            const imageBufferData = fs.createReadStream(image.path)
            const response = await imageKit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder :'user-resumes',
                transformation :{
                    pre : 'w-300 , h-300 , fo-face , z-0.75' + (removeBackground ? ',e-bgremove' : '')
                }
            });

            resumeDataCopy.personal_info.image = response.url

        }

        const resume = await Resume.findOneAndUpdate({ userId, _id: resumeId }, resumeDataCopy, { new: true })

        return res.status(200).json({ message: "Saved Successfully", resume })
    } catch (error) {
        console.error("Resume update error:", error);
        return res.status(400).json({ message: error.message })
    }
}

// controller for getting all user resumes
// get : /api/resumes/get-all
export const getAllResumes = async (req, res) => {
    try {
        const userId = req.userId;
        const allResumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
        return res.status(200).json({ allResumes });
    } catch (error) {
        console.error("Get all resumes error:", error);
        return res.status(400).json({ message: error.message });
    }
}