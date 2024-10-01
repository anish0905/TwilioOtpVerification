const OtpModel = require('../model/otp');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = new twilio(accountSid, authToken);

const sendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        // Check if phoneNumber exists in the request
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                msg: "Phone number is required."
            });
        }

        console.log(`Sending OTP to: ${phoneNumber}`);

        // Generate a 6-digit OTP without alphabets or special characters
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const cDate = new Date();

        // Save OTP and expiration date to the database (set expiration to 5 minutes)
        await OtpModel.findOneAndUpdate(
            { phoneNumber },
            { otp, otpExpiration: new Date(cDate.getTime() + 5 * 60 * 1000) },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send OTP via Twilio and wait for the response
        await twilioClient.messages.create({
            body: `Welcome to HomeLine. Your OTP is: ${otp}`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        return res.status(200).json({
            success: true,
            msg: "OTP sent successfully",
            otp
        });

    } catch (error) {
        console.error(`Error sending OTP: ${error.message}`);
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
};

module.exports = {
    sendOtp
};
