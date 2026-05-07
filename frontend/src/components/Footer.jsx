import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, Twitter, Facebook, Youtube, 
  MapPin, Phone, Mail, Shield, FileText 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#f7f7f7] pt-20 pb-10 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
             <span className="text-3xl font-black italic tracking-tighter text-[#ff385c]">Guide Goo</span>
          </div>
          <p className="text-[#717171] text-sm font-medium leading-relaxed">
            Your ultimate AI-powered travel companion. Discover hidden gems, book expert local guides, and experience India like never before. 🇮🇳
          </p>
          <div className="flex items-center space-x-5">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, idx) => (
              <a key={idx} href="#" className="text-[#222222] hover:text-[#ff385c] transition-all">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Explore Column */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#222222]">Explore India</h4>
          <ul className="space-y-4">
            {['Puri, Odisha', 'Varanasi, UP', 'Jaipur, Rajasthan', 'Rishikesh, Uttarakhand'].map(loc => (
              <li key={loc}><Link to="/book-guide" className="text-sm text-[#717171] hover:text-[#ff385c] transition-all font-medium">{loc}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company Column */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#222222]">Support & Policy</h4>
          <ul className="space-y-4">
            <li><Link to="/help" className="flex items-center gap-2 text-sm text-[#717171] hover:text-[#ff385c] transition-all font-medium"><Shield size={14} /> Safety Center</Link></li>
            <li><Link to="/help" className="flex items-center gap-2 text-sm text-[#717171] hover:text-[#ff385c] transition-all font-medium"><FileText size={14} /> Terms of Service</Link></li>
            <li><Link to="/help" className="flex items-center gap-2 text-sm text-[#717171] hover:text-[#ff385c] transition-all font-medium"><FileText size={14} /> Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#222222]">Get in Touch</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-[#717171] font-medium"><MapPin size={18} className="text-[#ff385c] shrink-0" /> Bhubaneswar, Odisha, India</li>
            <li className="flex items-center gap-3 text-sm text-[#717171] font-medium"><Phone size={18} className="text-[#ff385c] shrink-0" /> +91 7855091725</li>
            <li className="flex items-center gap-3 text-sm text-[#717171] font-medium"><Mail size={18} className="text-[#ff385c] shrink-0" /> guidego2026@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-10 border-t border-[#f7f7f7] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#222222] uppercase tracking-widest">
            © {currentYear} Guide Goo. All Rights Reserved.
          </p>
          <p className="text-[10px] text-[#717171] font-black uppercase tracking-[0.2em]">
            Developed with ❤️ by <span className="text-[#ff385c]">Bhagyabrata Gantayat</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#" className="transition-transform hover:scale-105 active:scale-95">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-10 w-auto" alt="Google Play" />
          </a>
          <a href="#" className="transition-transform hover:scale-105 active:scale-95">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" className="h-10 w-auto" alt="App Store" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
