import React, { useState } from 'react';
import { Star, X, Send, MessageSquare } from 'lucide-react';
import axios from 'axios';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await axios.post('/api/reviews', {
        bookingId: booking._id,
        guideId: booking.guideId._id,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-500">
        <div className="bg-primary-500 p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 border border-white/30 backdrop-blur-md">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight">Rate Your Experience</h2>
          <p className="text-primary-100 font-bold mt-1 text-sm">How was your tour with {booking.guideId.name}?</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Your Rating</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1 transition-transform hover:scale-125 duration-300"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      (hover || rating) >= star 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-slate-200'
                    } transition-colors`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Feedback</p>
            <textarea
              required
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you loved or how things could be improved..."
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:outline-none font-bold text-slate-700 placeholder:text-slate-300 resize-none transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 transition-all ${
              loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Submit Review</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
