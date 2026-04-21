const Guide = require('../models/Guide');
const User = require('../models/User');

class MatchingManager {
  constructor() {
    this.activeSearch = new Map(); // bookingId -> timeout
  }

  async startSearch(booking, io) {
    console.log(`Starting search for booking: ${booking._id}`);
    
    // 1. Get user details for notification
    const traveler = await User.findById(booking.userId);
    
    // 2. Find online & approved guides in the same location
    // We match if guide speaks ANY of the traveler's selected languages
    const matchingGuides = await Guide.find({
      location: booking.location,
      status: 'approved',
      isLive: true,
      languages: { $in: booking.languages }
    });

    console.log(`Found ${matchingGuides.length} eligible guides for location ${booking.location}`);

    // 3. Notify guides
    matchingGuides.forEach(guide => {
      io.to(`guide_${guide.userId}`).emit('new-booking', {
        bookingId: booking._id,
        travelerName: traveler.name,
        location: booking.location,
        duration: booking.duration,
        languages: booking.languages,
        totalPrice: booking.totalPrice,
        paymentMethod: booking.paymentMethod
      });
    });

    // 4. Set auto-timeout (3 mins)
    const timeout = setTimeout(async () => {
      this.cancelSearch(booking._id, io);
    }, 180000);

    this.activeSearch.set(booking._id.toString(), timeout);
  }

  cancelSearch(bookingId, io) {
    const timeout = this.activeSearch.get(bookingId.toString());
    if (timeout) {
      clearTimeout(timeout);
      this.activeSearch.delete(bookingId.toString());
      io.emit('booking_timeout', { bookingId });
    }
  }

  stopSearch(bookingId) {
    const timeout = this.activeSearch.get(bookingId.toString());
    if (timeout) {
      clearTimeout(timeout);
      this.activeSearch.delete(bookingId.toString());
    }
  }
}

module.exports = new MatchingManager();
