import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const body = await request.json();
    
    console.log('Forwarding inspection note to backend:', body);
    
    // Forward the request to the actual backend API
    const response = await fetch('https://wms-backend-hrayhaang8hzbdff.canadacentral-01.azurewebsites.net/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Backend response:', data);
      return NextResponse.json(data, { status: 200 });
    } else {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: 'Failed to submit inspection note', details: errorData },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
