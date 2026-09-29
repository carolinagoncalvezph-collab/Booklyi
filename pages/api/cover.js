export default async function handler(request, response) {
  const url = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
  const target = url.searchParams.get('url');
  if (!target) return response.status(400).send('Missing url');

  let remote;
  try {
    remote = new URL(target);
  } catch {
    return response.status(400).send('Invalid url');
  }

  const allowed = new Set(['books.google.com','books.googleusercontent.com','images-na.ssl-images-amazon.com','covers.openlibrary.org','openlibrary.org']);
  if (!allowed.has(remote.hostname)) return response.status(403).send('Host not allowed');

  try {
    const remoteResponse = await fetch(remote, { headers: { 'user-agent': 'Booklyi/1.0' } });
    if (!remoteResponse.ok) return response.status(remoteResponse.status).send('Cover unavailable');
    const contentType = remoteResponse.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) return response.status(415).send('Not an image');
    response.setHeader('Content-Type', contentType);
    response.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400');
    response.setHeader('CDN-Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    response.setHeader('Access-Control-Allow-Origin', '*');
    const buf = Buffer.from(await remoteResponse.arrayBuffer());
    return response.status(200).send(buf);
  } catch {
    return response.status(502).send('Cover unavailable');
  }
};
