import mailgun from 'mailgun-js';

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || '',
});

export const sendEmail = async ({ to, subject, html }: any) => {
    try {
        const data = {
            from: 'noreply@myGrades.ch',
            to,
            subject,
            html,
        };

        await mg.messages().send(data);
    } catch (error) {
        console.error(error);
        throw new Error("Error sending email");
    }
}