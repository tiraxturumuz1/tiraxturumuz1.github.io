const mongoose = require('mongoose');

const uri = process.env.DATABASE_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pidao';

async function main() {
  console.log('Testing MongoDB connection...');
  console.log(`Using URI: ${uri.replace(/:([^:@]+)@/, ':***@')}`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log('✅ MongoDB connection succeeded');
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

main();
