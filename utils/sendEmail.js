const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendEmail = async (options) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log('SendGrid API Key not found. Skipping email.');
        console.log('Email Options:', options);
        return;
    }

    const msg = {
        to: options.email,
        from: process.env.EMAIL_FROM, // Use the email address or domain you verified with SendGrid
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('SendGrid Error:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};

module.exports = sendEmail;
