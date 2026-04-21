import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, CheckCircle, 
  Users, Globe, Star, Navigation 
} from 'lucide-react';

const SERVICE_AREAS_INFO = {
  'Puri': {
    state: 'Odisha',
    desc: 'Sacred coastal city, home of Jagannath Temple and golden beaches. Experience the divine energy of one of India\'s most holy Char Dham sites.',
    image: 'https://images.unsplash.com/photo-1590393048529-679901f46f37?auto=format&fit=crop&q=80',
    stats: { guides: '12+', languages: 'English, Hindi, Odia, Bengali' }
  },
  'Konark': {
    state: 'Odisha',
    desc: 'UNESCO World Heritage Site — the magnificent Sun Temple. A 13th-century engineering marvel designed as a colossal chariot of the Sun God.',
    image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80',
    stats: { guides: '8+', languages: 'English, Hindi, Odia' }
  },
  'Chilika': {
    state: 'Odisha',
    desc: 'Asia\'s largest brackish water lagoon, famous for Irrawaddy dolphins, migratory birds, and the beautiful Kalijai Temple island.',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80',
    stats: { guides: '5+', languages: 'English, Hindi, Odia' }
  },
  'Bhubaneswar': {
    state: 'Odisha',
    desc: 'The Temple City of India, featuring over 700 ancient temples like Lingaraj and Mukteswar, blending modern life with spiritual history.',
    image: 'https://images.unsplash.com/photo-1605658601552-6d1a100579e0?auto=format&fit=crop&q=80',
    stats: { guides: '20+', languages: 'All Major Indian Languages' }
  },
  'Dhauli': {
    state: 'Odisha',
    desc: 'Historic rock edicts of Ashoka and the Shanti Stupa. The place where Emperor Ashoka renounced war and embraced Buddhism.',
    image: 'https://images.unsplash.com/photo-1589139331393-2713e7104b2a?auto=format&fit=crop&q=80',
    stats: { guides: '4+', languages: 'English, Hindi, Odia' }
  },
  'Gopalpur': {
    state: 'Odisha',
    desc: 'A quiet, nostalgic beach town perfect for sunrise walks. Once a busy seaport, it now offers a peaceful escape by the Bay of Bengal.',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80',
    stats: { guides: '3+', languages: 'English, Odia, Hindi' }
  },
  'Cuttack': {
    state: 'Odisha',
    desc: 'The Silver City — famous for its exquisite silver filigree work (Tarakasi) and the historic 14th-century Barabati Fort.',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80',
    stats: { guides: '6+', languages: 'English, Odia, Hindi' }
  },
  'Pipili': {
    state: 'Odisha',
    desc: 'Famous for its vibrant appliqué craft. Every lane is filled with colorful handicrafts, lanterns, and wall hangings.',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80',
    stats: { guides: '2+', languages: 'English, Odia, Hindi' }
  },
  'Goa': {
    state: 'Goa',
    desc: 'India\'s coastal paradise. Famous for its pristine beaches, vibrant culture, Portuguese heritage, and world-class nightlife.',
    image: 'https://images.unsplash.com/photo-1512783563744-ca7a47d28646?auto=format&fit=crop&q=80',
    stats: { guides: '50+', languages: 'English, Hindi, Konkani, Foreign' }
  }
};

const LocationDetailPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const info = SERVICE_AREAS_INFO[name] || {
    state: 'India',
    desc: 'A beautiful destination waiting for you to explore its hidden gems and local stories.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80',
    stats: { guides: 'Available', languages: 'Multilingual' }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img 
            src={info.image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/40 to-transparent" />
        </div>

        <div className="absolute top-10 left-10 z-20">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-black/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </button>
        </div>

        <div className="absolute bottom-10 left-10 z-20 space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
             <MapPin className="w-3 h-3" /> {info.state} India
           </div>
           <h1 className="text-7xl font-black text-white tracking-tighter italic font-serif leading-none">{name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-3 gap-20 mt-16">
        <div className="lg:col-span-2 space-y-12">
           <section className="space-y-6">
              <h2 className="text-3xl font-black text-white tracking-tight italic font-serif">About this Location</h2>
              <p className="text-xl text-[#8888a8] leading-relaxed font-medium">
                {info.desc}
              </p>
           </section>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1c1c28] p-8 rounded-[2rem] border border-white/5 space-y-4">
                 <Users className="w-8 h-8 text-[#4f7ef8]" />
                 <div>
                    <p className="text-[10px] font-black text-[#8888a8] uppercase tracking-widest mb-1">Available Guides</p>
                    <p className="text-2xl font-black text-white italic">{info.stats.guides}</p>
                 </div>
              </div>
              <div className="bg-[#1c1c28] p-8 rounded-[2rem] border border-white/5 space-y-4">
                 <Globe className="w-8 h-8 text-[#1D9E75]" />
                 <div>
                    <p className="text-[10px] font-black text-[#8888a8] uppercase tracking-widest mb-1">Languages</p>
                    <p className="text-sm font-bold text-white leading-snug">{info.stats.languages}</p>
                 </div>
              </div>
              <div className="bg-[#1c1c28] p-8 rounded-[2rem] border border-white/5 space-y-4">
                 <CheckCircle className="w-8 h-8 text-amber-500" />
                 <div>
                    <p className="text-[10px] font-black text-[#8888a8] uppercase tracking-widest mb-1">Status</p>
                    <p className="text-2xl font-black text-white italic">Instant</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#1c1c28] border border-white/5 rounded-[3rem] p-10 space-y-8 sticky top-10">
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-white tracking-tight italic font-serif">Experience {name}</h3>
                 <p className="text-xs text-[#8888a8] font-bold uppercase tracking-widest">Instant Matching Service</p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-sm text-white/70 font-medium">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Professional Storytellers
                 </div>
                 <div className="flex items-center gap-4 text-sm text-white/70 font-medium">
                    <Navigation className="w-4 h-4 text-[#4f7ef8]" /> Off-beat Sightseeing
                 </div>
                 <div className="flex items-center gap-4 text-sm text-white/70 font-medium">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75]" /> Verified & Secure
                 </div>
              </div>

              <button 
                onClick={() => navigate('/book-guide', { state: { location: name } })}
                className="w-full py-6 bg-[#4f7ef8] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Book a Guide Here <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailPage;
