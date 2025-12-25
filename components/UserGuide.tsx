
import React, { useState } from 'react';
import { UserRole } from '../types.ts';

interface UserGuideProps {
  role: UserRole;
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ role, onClose }) => {
  const [step, setStep] = useState(1);

  const assignerSteps = [
    {
      title: "1. Create a Request",
      icon: "fa-pen-to-square",
      color: "bg-indigo-100 text-indigo-600",
      content: "Click 'Ask for Help' and fill in task details. Mention the number of pages and your deadline. Our system estimates a fair contribution amount automatically."
    },
    {
      title: "2. Secure File Sharing",
      icon: "fa-shield-halved",
      color: "bg-amber-100 text-amber-600",
      content: "Never upload files directly. Upload your materials to Google Drive or Dropbox, set access to 'Anyone with link', and paste that link in the task description or chat."
    },
    {
      title: "3. Find a Helper",
      icon: "fa-users-viewfinder",
      color: "bg-emerald-100 text-emerald-600",
      content: "Browse the 'Available Helpers' list. You can filter by your college or pincode to find peers nearby. Send an invitation to a specific writer or wait for offers."
    },
    {
      title: "4. The Secure Room",
      icon: "fa-comments",
      color: "bg-purple-100 text-purple-600",
      content: "Once a helper accepts, a 'Secure Room' opens. Chat here to discuss details. When the work is ready, you'll see a 'Review' status. Confirm to finish!"
    }
  ];

  const writerSteps = [
    {
      title: "1. Setup Your Identity",
      icon: "fa-id-card",
      color: "bg-emerald-100 text-emerald-600",
      content: "Go to 'Me' and set your per-page rate. Add links to your previous work samples (G-Drive) in your portfolio to build trust with peers."
    },
    {
      title: "2. Manage Availability",
      icon: "fa-clock",
      color: "bg-amber-100 text-amber-600",
      content: "Toggle 'Study Status'. If you're busy with your own exams, switch to 'Busy Studying' so you don't get new requests. Switch to 'Ready' when you want to earn."
    },
    {
      title: "3. Explore the Board",
      icon: "fa-magnifying-glass-chart",
      color: "bg-indigo-100 text-indigo-600",
      content: "Browse the Support Requests. Use filters to find tasks from your own college. You can 'Offer to Help' or discuss the contribution amount via chat."
    },
    {
      title: "4. Deliver & Complete",
      icon: "fa-check-double",
      color: "bg-purple-100 text-purple-600",
      content: "Keep the assigner updated in the chat. Once finished, mark as 'Ready for Review'. Once the peer confirms, the task moves to your history."
    }
  ];

  const currentSteps = role === 'assigner' ? assignerSteps : writerSteps;
  const currentStepData = currentSteps[step - 1];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col border border-white/20">
        <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">How it Works</h3>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Guide for {role}s</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white text-slate-400 flex items-center justify-center shadow-sm hover:text-rose-500 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-8 flex-1">
          <div className="flex justify-center mb-8">
            <div className={`w-20 h-20 ${currentStepData.color} rounded-[2rem] flex items-center justify-center text-3xl shadow-inner animate-in fade-in zoom-in duration-500`}>
              <i className={`fas ${currentStepData.icon}`}></i>
            </div>
          </div>

          <div className="text-center space-y-4 min-h-[160px]">
            <h4 className="text-lg font-black text-slate-800 tracking-tight">{currentStepData.title}</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
              {currentStepData.content}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            {currentSteps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${step === idx + 1 ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="p-8 pt-0 flex gap-3">
          {step > 1 && (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
            >
              Previous
            </button>
          )}
          {step < currentSteps.length ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="flex-[2] py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-all"
            >
              Got it, let's go!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
