export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    // 1. Parse the incoming request body
    const body = JSON.parse(event.body);

    // 2. Wrap it in a 'data' object (SheetDB's standard requirement)
    const payload = {
      data: [body]
    };

    const SHEETDB_URL = 'https://sheetdb.io/api/v1/invgqd7zpxg5h';
    const response = await fetch(SHEETDB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SHEETDB_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('SheetDB Error:', result);
      return { statusCode: 500, body: JSON.stringify({ message: 'Error', details: result }) };
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Success' }) };
    
  } catch (error) {
    console.error('Function Error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};