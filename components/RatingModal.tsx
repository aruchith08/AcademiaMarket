
import React, { useState } from 'react';
import { Task, UserRole } from '../types.ts';

interface RatingModalProps {
  task: Task;
  role: UserRole;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ task, role, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');

  const targetName = role === 'assigner' ? 'Writer' : 'Assigner';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-200 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-sm border border-indigo-100">
            <i className="fas fa-star text-3xl"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Rate your Experience</h3>
          <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">
            Project: <span className="text-indigo-600 font-bold">{task.title}</span><br/>
            How was your experience working with the {targetName}?
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-3xl transition-all transform hover:scale-125 ${
                star <= (hover || rating) ? 'text-yellow-400' : 'text-slate-200'
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <i className={`${star <= (hover || rating) ? 'fas' : 'far'} fa-star`}></i>
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-8">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Leave a short review (Optional)</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={`Tell others about this ${targetName.toLowerCase()}...`}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 outline-none text-xs font-medium min-h-[100px] resize-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            disabled={rating === 0}
            onClick={() => onSubmit(rating, review)}
            className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${
              rating === 0 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 active:scale-95'
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
