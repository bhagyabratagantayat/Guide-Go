import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Languages, DollarSign, Calendar, MapPin, ChevronLeft, ShieldCheck, Clock, CheckCircle2, QrCode, Banknote } from 'lucide-react';
import Receipt from '../components/Receipt';

const GuideProfile = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [duration, setDuration] = useState(2);
  const [date, setDate] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [bookedBooking, setBookedBooking] = useState(null);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);

  const proceedToPaymentSelection = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return alert('Please login to book a guide');
    if (!date) return alert('Please select a date');
    setShowPaymentSelection(true);
  };

  const confirmBooking = async () => {
    if (!paymentMethod) return alert('Please select a payment method');
    
    setBookingLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const { data: booking } = await axios.post('/api/bookings', {
        guideId: guide.userId._id,
        location: 'Puri, Odisha', 
        bookingTime: new Date(date).toISOString(),
        price: guide.pricePerHour * duration,
        paymentMethod: paymentMethod
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      setBookedBooking(booking);
      setBookingSuccess(true);
      setShowReceipt(true);
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const { data } = await axios.get(`/api/guides`);
        const found = data.find(g => g._id === id);
        setGuide(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (guide?.userId?._id) {
          const { data } = await axios.get(`/api/reviews/guide/${guide.userId._id}`);
          setReviews(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [guide]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!guide) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Guide not found</h2><Link to="/guides" className="text-primary-600 underline">Back to Map</Link></div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/guides" className="inline-flex items-center text-slate-500 hover:text-primary-600 mb-8 font-bold transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 rounded-3xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-4xl uppercase overflow-hidden shadow-inner">
                {guide.userId.profilePicture ? <img src={guide.userId.profilePicture} className="w-full h-full object-cover" /> : guide.userId.name.charAt(0)}
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 leading-tight">{guide.userId.name}</h1>
                    <div className="flex items-center justify-center md:justify-start mt-2 space-x-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified Guide
                      </span>
                      <div className="flex items-center text-yellow-500 font-bold">
                        <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                        <span>{guide.rating}</span>
                        <span className="text-slate-400 text-xs ml-1">({guide.numReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Experience</p>
                    <p className="text-slate-800 font-bold flex items-center"><Clock className="w-4 h-4 mr-2 text-primary-500" /> {guide.experience || '3+ Years'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pricing</p>
                    <p className="text-slate-800 font-bold flex items-center"><DollarSign className="w-4 h-4 mr-1 text-green-600" /> ₹{guide.pricePerHour}/hr</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Location</p>
                    <p className="text-slate-800 font-bold flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" /> Puri, Odisha</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-800">About Me</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {guide.description || "Passionate local guide with deep knowledge of history and culture. I love showing tourists the hidden gems and sharing authentic stories of our beautiful region."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Expertise & Languages</h3>
            <div className="flex flex-wrap gap-3">
              {guide.languages.map((lang, idx) => (
                <span key={idx} className="px-5 py-2.5 bg-slate-50 text-slate-700 rounded-2xl font-bold border border-slate-100 flex items-center text-sm">
                  <Languages className="w-4 h-4 mr-2 text-primary-500" /> {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900">What People Say</h3>
            <div className="grid grid-cols-1 gap-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 overflow-hidden">
                        {review.touristId.profilePicture ? <img src={review.touristId.profilePicture} /> : review.touristId.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{review.touristId.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1.5" />
                      <span className="text-sm font-black text-slate-800">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-primary-200/20 border border-slate-100 sticky top-28">
            {bookingSuccess ? (
              <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Booking Requested!</h3>
                <p className="text-slate-500 font-bold">Redirecting to your bookings...</p>
              </div>
            ) : showPaymentSelection ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-slate-900">Payment</h3>
                  <button onClick={() => setShowPaymentSelection(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Cancel</button>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => setPaymentMethod('cash')}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${paymentMethod === 'cash' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900">Cash on Service</p>
                        <p className="text-xs font-bold text-slate-500">Pay the guide directly during the tour</p>
                      </div>
                    </div>
                    {paymentMethod === 'cash' && <CheckCircle2 className="w-5 h-5 text-primary-500" />}
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`w-full p-4 rounded-2xl border-2 flex flex-col transition-all ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-xl ${paymentMethod === 'upi' ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-900">Pay via UPI</p>
                          <p className="text-xs font-bold text-slate-500">Scan QR or use UPI ID</p>
                        </div>
                      </div>
                      {paymentMethod === 'upi' && <CheckCircle2 className="w-5 h-5 text-primary-500" />}
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-4 pt-4 border-t border-primary-200/50 flex flex-col items-center animate-in zoom-in duration-300">
                        <div className="bg-white p-2 rounded-xl shadow-inner border border-slate-100 mb-3">
                           <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=guidego@upi&pn=GuideGo%20Platform&am=${guide.pricePerHour * duration}&cu=INR`} alt="UPI QR Code" className="w-32 h-32" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-100">UPI ID: <span className="text-primary-600">guidego@upi</span></p>
                        <p className="text-xs font-bold text-slate-500 mt-3 text-center">Scan QR or pay using UPI ID and confirm booking.</p>
                      </div>
                    )}
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xl font-black text-slate-900 mb-6">
                    <span>Total Amount</span>
                    <span className="text-primary-600">₹{guide.pricePerHour * duration}</span>
                  </div>
                  <button 
                    onClick={confirmBooking}
                    disabled={bookingLoading || !paymentMethod}
                    className={`w-full py-5 text-white rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 ${bookingLoading || !paymentMethod ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/40 hover:-translate-y-1'}`}
                  >
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Quick Book</h3>
                <div className="space-y-6">
                   <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Date</label>
                        <input 
                          type="date" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-transparent font-bold text-slate-800 outline-none" 
                        />
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration (Hours)</label>
                        <select 
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="w-full bg-transparent font-bold text-slate-800 outline-none"
                        >
                          {[1,2,3,4,5,6,7,8].map(h => <option key={h} value={h}>{h} {h === 1 ? 'Hour' : 'Hours'}</option>)}
                        </select>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-100 space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                        <span>Rate / Hour</span>
                        <span>₹{guide.pricePerHour}</span>
                      </div>
                      <div className="flex justify-between items-center text-xl font-black text-slate-900">
                        <span>Estimated Total</span>
                        <span className="text-primary-600">₹{guide.pricePerHour * duration}</span>
                      </div>
                   </div>

                   <button 
                    onClick={proceedToPaymentSelection}
                    className="w-full py-5 text-white rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 bg-primary-600 hover:bg-primary-700 shadow-primary-500/40 hover:-translate-y-1"
                   >
                     Proceed to Payment
                   </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showReceipt && bookedBooking && (
        <Receipt 
          booking={bookedBooking} 
          onClose={() => {
            setShowReceipt(false);
            navigate('/bookings');
          }} 
        />
      )}
    </div>
  );
};

export default GuideProfile;
