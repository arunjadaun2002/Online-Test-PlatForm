const nodemailer = require('nodemailer');
require('dotenv').config();

// Create mail transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,  // Use `true` for port 465, `false` for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send emails
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        console.log('✅ Email sent successfully');
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

module.exports = sendEmail;
