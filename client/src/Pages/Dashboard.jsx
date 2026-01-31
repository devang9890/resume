import React, { useEffect, useState } from "react";
import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const colors = ["#6366F1", "#A855F7", "#EC4899", "#F59E0B", "#10B981"];
  const navigate = useNavigate();

  // ✅ Load all resumes
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/resumes/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllResumes(data.allResumes || []);
    } catch (error) {
      console.error('Load resumes error:', error);
      toast.error(error?.response?.data?.message || 'Failed to load resumes');
    }
  };

  // ✅ Create resume
  const createResume = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
      toast.success('Resume created successfully');
    } catch (error) {
      console.error('Create resume error:', error);
      toast.error(error?.response?.data?.message || 'Failed to create resume');
    }
  };

  // ✅ Upload resume
  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Validate file type
      if (!resume.name.toLowerCase().endsWith('.pdf')) {
        toast.error('Please upload a PDF file');
        setIsLoading(false);
        return;
      }

      // Extract text from PDF
      let resumeText;
      try {
        resumeText = await pdfToText(resume);
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError);
        toast.error('Failed to read PDF file. Please ensure it\'s a valid PDF.');
        setIsLoading(false);
        return;
      }

      // Validate extracted text
      if (!resumeText || resumeText.trim().length < 50) {
        toast.error('Could not extract enough text from PDF. Please try a different file.');
        setIsLoading(false);
        return;
      }

      console.log('Extracted resume text length:', resumeText.length);
      console.log('First 100 chars:', resumeText.substring(0, 100));
      console.log('Sending upload request with title:', title);

      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error('Upload resume error:', error);
      console.error('Error response:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      const errorMsg = error?.response?.data?.message || error.message || 'Failed to upload resume';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Edit title
  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(
        "/api/resumes/update",
        {
          resumeId: editResumeId,
          resumeData: { title },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllResumes((allResumes) =>
        allResumes.map((r) =>
          r._id === editResumeId ? { ...r, title } : r
        )
      );
      setTitle("");
      setEditResumeId(null);
      toast.success(data.message || "Title updated successfully");
    } catch (error) {
      console.error('Edit title error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update title');
    }
  };

  // ✅ Delete resume
  const deleteResume = async (resumeId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
      if (confirmDelete) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllResumes(allResumes.filter((r) => r._id !== resumeId));
        toast.success(data.message || "Deleted successfully");
      }
    } catch (error) {
      console.error('Delete resume error:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete resume');
    }
  };

  // ✅ Load data on mount
  useEffect(() => {
    loadAllResumes();
  }, []);

  // ✅ Handle file select
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-0 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name || "Devang Singh"}
        </p>

        {/* Create & Upload Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 bg-white group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 bg-white group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        {/* Resume Grid */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                key={resume._id}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: `${baseColor}40`,
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title || "Untitled Resume"}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: `${baseColor}90` }}
                >
                  updated on {new Date(resume.updatedAt).toLocaleDateString("en-IN")}
                </p>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-6 p-1 bg-white/50 rounded text-slate-700 hover:text-red-500 transition-colors"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
                      setTitle(resume.title);
                    }}
                    className="size-6 p-1 bg-white/50 rounded text-slate-700 hover:text-blue-500 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* === Modals === */}

        {/* Create Resume Modal */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                type="text"
                placeholder="Enter Resume Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {/* Upload Resume Modal */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

              <input
                type="text"
                placeholder="Enter Resume Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />

              <label htmlFor="resume-input" className="block text-sm text-slate-700">
                Select Resume File (PDF only)
                <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                  {resume ? (
                    <div className="text-center">
                      <p className="text-sm text-green-700 font-medium">{resume.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(resume.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="size-14 stroke-1" />
                      <p>Upload PDF Resume</p>
                      <p className="text-xs text-slate-500">Only PDF files are supported</p>
                    </>
                  )}
                  <input
                    id="resume-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    required
                  />
                </div>
              </label>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                {isLoading ? "Uploading..." : "Upload Resume"}
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                  setResume(null);
                }}
              />
            </div>
          </form>
        )}

        {/* Edit Resume Title Modal */}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                type="text"
                placeholder="Enter Resume Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId(null);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
