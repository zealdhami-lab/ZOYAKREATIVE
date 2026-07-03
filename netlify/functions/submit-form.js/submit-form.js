export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const SHEETDB_URL = 'https://sheetdb.io/api/v1/invgqd7zpxg5h';
  const response = await fetch(SHEETDB_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SHEETDB_TOKEN}`
    },
    body: event.body
  });

  return {
    statusCode: response.ok ? 200 : 500,
    body: JSON.stringify({ message: response.ok ? 'Success' : 'Error' })
  };
};