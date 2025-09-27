import mongoose from 'mongoose';

const crawledDataSchema = new mongoose.Schema({
  request_id: {
    type: Number,
    required: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
  },
  data: [{
    title: String,
    date: String,
    // Add other fields as needed
  }],
  validated: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

crawledDataSchema.index({ request_id: 1 });

const CrawledData = mongoose.model('CrawledData', crawledDataSchema);

export default CrawledData;