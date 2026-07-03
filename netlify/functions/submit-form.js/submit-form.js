export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const response = await fetch('YOUR_SHEETDB_API_URL', {
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
git add .
git commit -m "Initial upload of jewelry site"
git push -u origin main