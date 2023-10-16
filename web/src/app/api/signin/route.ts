import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  console.log(request.url);

  // referer and other header info is peeled off by default
  const response = await fetch('http://localhost:3001/signin', {
    method: 'POST',
    headers: {
      ...request.headers,
      referer: request.headers.get('referer') || '',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`API Request Fail::${request.url} ${response.status}`);
  }

  const resCookies = response.headers.get('set-cookie');
  if (resCookies) {
    const store = cookies();

    const splitCookies = resCookies.split(', ');
    const splitProperties = splitCookies.map(cookie => cookie.split('; '));
    splitProperties.forEach((cookie) => {
      const [name, value] = cookie[0].split('=');
      const options = setCookieOptions(cookie.slice(1));
      console.log('set-cookie', name, decodeURI(value), options);
      store.set(name, decodeURI(value), options);
    });
  }

  const data = await response.json();
  return Response.json(data);
}

const setCookieOptions = (optionQueries: string[]): Partial<ResponseCookie> => {
  const entries = optionQueries.map((query) => {
    const [key, value] = query.split('=');
    const loweredKey = key[0].toLowerCase() + key.slice(1);
    return [loweredKey, value ? value : true];
  });
  return Object.fromEntries(entries);
}