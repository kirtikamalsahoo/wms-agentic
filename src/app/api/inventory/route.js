// API Route to proxy inventory movements requests and handle CORS
export async function GET() {
  try {
    console.log('📦 Proxying inventory movements API request...');
    
    const response = await fetch('https://wms-backend-hrayhaang8hzbdff.canadacentral-01.azurewebsites.net/inventory_movements/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WMS-Frontend/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Upstream API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.length} inventory movement records`);

    return Response.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('❌ Inventory movements API proxy error:', error);
    
    return Response.json(
      { 
        error: 'Failed to fetch inventory movements', 
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
