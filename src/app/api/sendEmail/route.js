import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    console.log({req, res});
    if (req.method === 'POST') {
        const { to, subject, text } = req.body;

        // Configura el transportador de nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL_USER, // Tu correo
                pass: process.env.NEXT_PUBLIC_EMAIL_PASS  // Tu contraseña
            },
            tls: {
                rejectUnauthorized: false,
              },
        });

        const mailOptions = {
            from: process.env.NEXT_PUBLIC_EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to send email' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
