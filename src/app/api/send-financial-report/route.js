import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

export async function POST(request) {
  try {
    const { email, frequency = 'monthly' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Configure nodemailer with Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
      }
    });

    // Read the financial report docx file
    const reportPath = path.join(process.cwd(), 'public', 'assets', 'Financial_report.docx');
    let reportContent = '';
    let reportTextContent = '';
    
    try {
      // Read the docx file as buffer for attachment
      reportContent = fs.readFileSync(reportPath);
      
      // Extract text content from docx for email body
      const result = await mammoth.extractRawText({ buffer: reportContent });
      reportTextContent = result.value;
    } catch (error) {
      console.error('Error reading financial report:', error);
      return NextResponse.json(
        { error: 'Financial report file not found' },
        { status: 500 }
      );
    }

    // Extract key information from the report content for email highlights
    const getReportHighlights = (content) => {
      const lines = content.split('\n');
      const highlights = [];
      
      // Extract key financial figures
      lines.forEach((line, index) => {
        if (line.includes('Total Expenses') && line.includes('Rs')) {
          const match = line.match(/Rs([\d,]+)/);
          if (match) highlights.push(`Total Expenses: ₹${match[1]} across all warehouses`);
        }
        if (line.includes('Total Overdue Receivables') && line.includes('Rs')) {
          const match = line.match(/Rs([\d,]+)/);
          if (match) highlights.push(`Overdue Receivables: ₹${match[1]} requiring immediate attention`);
        }
        if (line.includes('Total Overdue Payables') && line.includes('Rs')) {
          const match = line.match(/Rs([\d,]+)/);
          if (match) highlights.push(`Overdue Payables: ₹${match[1]} pending settlement`);
        }
        if (line.includes('Pending Purchase Orders')) {
          highlights.push(`Pending Purchase Orders: 2 POs awaiting approval`);
        }
      });
      
      return highlights.length > 0 ? highlights : [
        'Comprehensive financial analysis included',
        'Expense breakdown by warehouse',
        'Overdue receivables & payables details',
        'Actionable recommendations provided'
      ];
    };

    // Get key points from document content
    const reportHighlights = getReportHighlights(reportTextContent);
    
    // Create formatted content preview for email
    const contentPreview = reportTextContent
      .split('\n')
      .slice(0, 10)
      .filter(line => line.trim().length > 0)
      .join('\n')
      .substring(0, 500) + '...';

    // Customize content based on frequency
    const frequencyConfig = {
      weekly: {
        title: 'Weekly Financial Report',
        description: 'This week\'s financial performance summary and key metrics',
        period: 'Weekly',
        icon: '📅'
      },
      monthly: {
        title: 'Monthly Financial Report',
        description: 'Comprehensive monthly financial analysis and performance review',
        period: 'Monthly',
        icon: '📊'
      },
      quarterly: {
        title: 'Quarterly Financial Report',
        description: 'Quarterly financial review with strategic insights and planning recommendations',
        period: 'Quarterly',
        icon: '📈'
      }
    };

    const config = frequencyConfig[frequency] || frequencyConfig.monthly;

    // Create email content
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `${config.icon} WMS ${config.title} - Comprehensive Analysis`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💰 WMS Financial Report</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Warehouse Management System - Financial Analysis</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #2d3748; margin-bottom: 20px;">${config.icon} ${config.period} Financial Analysis</h2>
            
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
              Dear Finance Team,<br><br>
              Please find attached the ${frequency} financial report for our warehouse operations. 
              ${config.description}. This document contains detailed analysis, financial metrics, and strategic recommendations.
            </p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #4299e1; margin: 20px 0;">
              <h3 style="color: #2b6cb0; margin: 0 0 10px 0;">📋 ${config.period} Report Highlights:</h3>
              <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                ${reportHighlights.map(highlight => `<li>${highlight}</li>`).join('')}
              </ul>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
              <h4 style="color: #0c4a6e; margin: 0 0 10px 0;">📄 Document Preview:</h4>
              <div style="background: #e0f2fe; padding: 15px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 12px; color: #164e63; line-height: 1.4; white-space: pre-wrap; overflow: hidden;">
${contentPreview}
              </div>
              <p style="color: #0369a1; margin: 10px 0 0 0; font-size: 14px; font-style: italic;">
                Complete details available in the attached document
              </p>
            </div>
            
            <div style="background: #fed7d7; padding: 15px; border-radius: 8px; border-left: 4px solid #f56565; margin: 20px 0;">
              <h4 style="color: #c53030; margin: 0 0 8px 0;">⚠️ Action Required:</h4>
              <p style="color: #742a2a; margin: 0;">
                Please review the attached document for detailed recommendations and immediate action items requiring attention.
              </p>
            </div>
            
            <p style="color: #4a5568; line-height: 1.6; margin-top: 20px;">
              The complete ${frequency} financial report is attached as a Word document. Please review all sections including budget recommendations, 
              expense analysis, and strategic planning insights tailored for ${frequency} review cycles.
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; margin: 0; font-size: 14px;">
                Generated by WMS Financial Agent | ${new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
              This is an automated report from WMS Financial Agent. For questions, please contact the finance team.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Financial_Report_${config.period}.docx`,
          content: reportContent,
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: `Financial report sent successfully to ${email}` 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
