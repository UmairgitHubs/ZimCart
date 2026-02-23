import twilio from 'twilio';
import { ApiError } from '../utils/ApiError.js';

const getTwilioClient = () => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.warn("⚠️ Twilio Configuration missing. SMS will not be sent.");
        return null;
    }

    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

export const sendSMS = async (to: string, message: string) => {
    const client = getTwilioClient();

    if (!client) {
        console.log(`\n[MOCK SMS] To: ${to}, Body: ${message}`);
        return;
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER!,
            to: to.startsWith('+') ? to : `+${to}`, // Ensure E.164 format
        });

        console.log(`SMS sent successfully: ${result.sid}`);
        return result;
    } catch (error: any) {
        console.error("Error sending SMS via Twilio: ", error);
        
        // We log but don't strictly throw if it's a non-fatal notification error
        // though for transactional SMS we might want to know.
        if (error.code === 21614) { // Invalid number
             console.warn(`Attempted to send SMS to invalid number: ${to}`);
             return;
        }
        
        throw new ApiError(500, `Failed to send SMS: ${error.message}`);
    }
};
