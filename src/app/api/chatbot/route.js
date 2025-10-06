import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { user_prompt } = await request.json();
    
    if (!user_prompt) {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 }
      );
    }

    // Call the external API
    const response = await fetch('https://wms-backend-hrayhaang8hzbdff.canadacentral-01.azurewebsites.net/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_prompt: user_prompt,
        db_config: {
          dbname: "Warehouse_DB",
          user: "wms_user",
          password: "Wams-2025",
          host: "wmsdb.postgres.database.azure.com",
          port: 5432
        }
      })
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      reply: data.reply || data.response || data.message || data.answer || 'Response received successfully',
      response: data.reply || data.response || data.message || data.answer || 'Response received successfully',
      success: true
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process chatbot request',
        message: 'Sorry, I\'m having trouble processing your request. Please try again later.',
        success: false
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
