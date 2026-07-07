import nodemailer from 'nodemailer';
import {env} from '../config/env.js';

export const transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
});