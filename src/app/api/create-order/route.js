import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.products || !Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json(
        { error: 'Products array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate each product
    for (const product of body.products) {
      if (!product.product_id || !product.quantity) {
        return NextResponse.json(
          { error: 'Each product must have product_id and quantity' },
          { status: 400 }
        );
      }
    }

    // Prepare the payload for the external API
    const apiPayload = {
      dbname: body.dbname || "Warehouse_DB",
      user: body.user || "wms_user", 
      password: body.password || "Wams-2025",
      host: body.host || "wmsdb.postgres.database.azure.com",
      port: body.port || 5432,
      customer_id: body.customer_id || 1,
      products: body.products.map(product => ({
        product_id: parseInt(product.product_id),
        quantity: parseInt(product.quantity)
      }))
    };

    console.log('Calling external order API with payload:', apiPayload);

    // Call the external API
    const response = await fetch('https://wms-backend-hrayhaang8hzbdff.canadacentral-01.azurewebsites.net/create_order_agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', response.status, errorText);
      
      return NextResponse.json(
        { 
          error: 'External API call failed',
          details: errorText,
          status: response.status 
        },
        { status: 502 }
      );
    }

    const result = await response.json();
    console.log('External API success:', result);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Order creation API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json({
    message: 'Order creation API endpoint',
    method: 'POST',
    requiredFields: {
      products: [
        {
          product_id: 'number',
          quantity: 'number'
        }
      ]
    },
    optionalFields: {
      customer_id: 'number (default: 0)',
      dbname: 'string (default: "Warehouse_DB")',
      user: 'string (default: "wms_user")',
      password: 'string (default: "Wams-2025")',
      host: 'string (default: "wmsdb.postgres.database.azure.com")',
      port: 'number (default: 5432)'
    }
  });
}
