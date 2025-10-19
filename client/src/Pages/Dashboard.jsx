import React, { useEffect, useState } from "react";
import { PlusIcon, UploadCloudIcon } from "lucide-react";
import { dummyResumeData } from "../assets/assets";

const Dashboard = () => {
  const [allResumes , setAllResumes] = useState([])

  const loadAllResumes = async () =>{
    setAllResumes(dummyResumeData)
  } 

  useEffect(()=>{
    loadAllResumes()
  },[])

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Welcome Text */}
        <p className="text-2xl font-medium mb-0 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, Devang Singh
        </p>

        {/* Buttons Section */}
        <div className="flex gap-4 mt-6">

          {/* Create Resume */}
          <button className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 bg-white group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          {/* Upload Existing */}
          <button className="w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 bg-white group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
