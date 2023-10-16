import { Buttons } from '@/components/Buttons';

const signinFromServer = async () => {
  const url = 'http://localhost:3001/signin';
  const response = await fetch(url, { method: 'POST', credentials: 'include' });
  if (!response.ok) {
    throw new Error(`API Request Fail::${url} ${response.status}`);
  }
}

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/signin');
  if (res.ok) {
    const data = await res.json();
    console.log(data);
  }

  return (
    <main>
      <Buttons />
    </main>
  )
}
