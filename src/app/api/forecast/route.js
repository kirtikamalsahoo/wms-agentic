import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('🔄 Proxy: Forwarding forecast request to backend...', body);
    
    // Forward the request to the actual forecast API
    const response = await fetch('https://wms-backend-hrayhaang8hzbdff.canadacentral-01.azurewebsites.net/run-forecast-agent/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const responseData = await response.json();
    
    console.log('✅ Proxy: Received response from backend:', responseData);
    
    if (response.ok) {
      return NextResponse.json(responseData);
    } else {
      return NextResponse.json(
        { error: responseData.message || 'Backend API error' }, 
        { status: response.status }
      );
    }
    
  } catch (error) {
    console.error('❌ Proxy: Error forwarding request:', error);
    return NextResponse.json(
      { error: 'Proxy server error: ' + error.message }, 
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
}
