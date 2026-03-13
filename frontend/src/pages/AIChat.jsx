import React, { useState } from 'react';
import axios from 'axios';
import { Send, Map, Calendar, Coffee, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIChat = () => {
  const [question, setQuestion] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data } = await axios.post('/api/ai/travel', {
        question: q || question
      }, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setItinerary(data.response);
    } catch (error) {
      alert('Failed to generate response. Please ensure you are logged in.');
    }
    setLoading(false);
  };

  const handleSuggestion = (suggestion) => {
    setQuestion(suggestion);
    handleSubmit(null, suggestion);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center space-x-3 mb-4">
          <Bot className="w-10 h-10 text-primary-600" />
          <span>AI Travel Assistant</span>
        </h1>
        <p className="text-slate-600">Generate a personalized travel itinerary in seconds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 h-fit bg-white p-6 rounded-3xl sticky top-24 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Send className="w-5 h-5 mr-2 text-primary-600" /> Plan Your Trip
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">How can I help you?</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Plan a 1 day trip in Puri"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none h-48"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 shadow-lg'}`}
            >
              {loading ? 'Thinking...' : 'Ask Assistant'}
            </button>
          </form>

          <div className="mt-8 space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Try these</p>
            {[
              "Plan a 1 day trip in Puri",
              "Best seafood restaurants nearby",
              "Hidden gems to visit in Odisha"
            ].map((s, i) => (
              <button 
                key={i}
                onClick={() => handleSuggestion(s)}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 text-xs font-bold text-slate-600 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 min-h-[500px] bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {itinerary ? (
            <div className="p-8 prose prose-slate max-w-none">
              <div className="flex items-center justify-between mb-8 pb-4 border-b">
                 <h2 className="text-2xl font-bold m-0 text-slate-800">Your Custom Itinerary</h2>
                 <div className="flex space-x-2">
                    <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Calendar className="w-5 h-5" /></button>
                    <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Map className="w-5 h-5" /></button>
                 </div>
              </div>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans">
                {itinerary}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-center flex-col">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6">
                <Coffee className="w-10 h-10 text-primary-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ready when you are!</h3>
              <p className="text-slate-500 max-w-xs">Fill in your destination and interests on the left to generate your dream trip itinerary.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;
