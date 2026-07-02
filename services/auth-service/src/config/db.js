import mongoose from 'mongoose';

import { env } from './env.js';


const connectDB = async () => {
    try{
        await mongoose.connect(env.MONGO_URI);

        console.log('MongoDB connected');
    }
    catch (err){
        console.error('Error connecting to MongoDB:');

        console.error(err);

        process.exit(1);
    };


};

export default connectDB;