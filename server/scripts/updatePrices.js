const mongoose = require('mongoose');
const Album = require('../models/Album');

const MONGO_URI = 'mongodb://127.0.0.1:27017/vinyleth';

const NEW_PRICES = {
  'Dark Side of the Moon':                    0.005,
  'Abbey Road':                               0.003,
  'Rumours':                                  0.004,
  'Kind of Blue':                             0.006,
  'A Love Supreme':                           0.007,
  "What's Going On":                          0.004,
  'I Never Loved a Man the Way I Love You':   0.004,
  'Homework':                                 0.005,
  'Selected Ambient Works 85–92':             0.006,
  'Never Mind the Bollocks':                  0.003,
  'London Calling':                           0.003,
  'Goldberg Variations':                      0.008,
  'Illmatic':                                 0.004,
  'To Pimp a Butterfly':                      0.007,
  'Malibu':                                   0.003,
};

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  for (const [title, price] of Object.entries(NEW_PRICES)) {
    const result = await Album.updateOne({ title }, { $set: { priceEth: price } });
    if (result.matchedCount === 0) {
      console.warn(`  NOT FOUND: "${title}"`);
    } else {
      console.log(`  ${title}: → ${price} ETH`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err => { console.error(err); process.exit(1); });
