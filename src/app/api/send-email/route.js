import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { to, subject, html } = await request.json();

    // Create transporter object using Gmail SMTP credentials from .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SENDER_EMAIL, // your Gmail address
        pass: process.env.SENDER_PASSWORD, // your Gmail app password
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"WMS Agentic System" <${process.env.SENDER_EMAIL}>`, // use your Gmail as sender
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Email sent from:', process.env.SENDER_EMAIL);
    console.log('Email sent to:', to);

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      from: process.env.SENDER_EMAIL,
      to: to
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send email' 
      },
      { status: 500 }
    );
  }
}
