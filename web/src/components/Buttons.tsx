'use client';

import * as venturiApi from '@meshed3d/venturi-api/lib/sdk/src/functional';
import { IConnection } from '@nestia/fetcher';

const connection = (options?: 'json'): IConnection => {
  const config: IConnection = {
    host: 'https://api2.venturi.design/api',
    headers: {
      'landing-api-key': '',
    },
    options: {
      credentials: 'include',
    }
  };

  return config;
};

const API = venturiApi;
async function venturiGuestSignin() {
  const response = await API.users.signin.guestSignIn(connection());
  if (!response.result) {
    throw new Error(`API Request Fail::${response.statusCode}`);
  }
  return response.data;
}
async function venturiGetImage() {
  const response = await API.images.findImage(connection(), '64ee5cbbd955dcd6696a3fed');
  if (!response.result) {
    throw new Error(`API Request Fail::${response.statusCode}`);
  }
  return response.data;
}

async function signinFromClient() {
  const url = 'http://localhost:3001/signin';
  const response = await fetch(url, { method: 'POST', credentials: 'include' });
  if (!response.ok) {
    throw new Error(`API Request Fail::${url} ${response.status}`);
  }

  return response.json();
}
async function signinFromRoute() {
  const response = await fetch('/api/signin');
  if (!response.ok) {
    throw new Error('')
  }
  return response.json();
}

type ButtonsProps = {}

export function Buttons({}: ButtonsProps) {
  const clientSigninHandler = async () => {
    const data = await signinFromClient();
    console.log('clientSigninHandler', data);
  }
  const clientGetUserHandler = async () => {
    console.log('clientGetUserHandler');
  }

  const routeSigninHandler = async () => {
    const data = await signinFromRoute();
    console.log('routeSigninHandler', data);
  }
  const routeGetUserHandler = async () => {
    console.log('requestGetUserHandler');
  }
  
  const serverSigninHandler = async () => {
    const data = await venturiGuestSignin();
    console.log('serverSigninHandler', data);
  }
  const serverGetUserHandler = async () => {
    const data = await venturiGetImage();
    console.log('serverGetUserHandler', data);
  }

  return (
    <div>
      <div>
        Request from Client
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={clientSigninHandler}>signin</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={clientGetUserHandler}>getUser</button>
      </div>
      <div>
        Request from Route
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={routeSigninHandler}>signin</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={routeGetUserHandler}>getUser</button>
      </div>
      <div>
        Request from Server
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={serverSigninHandler}>signin</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={serverGetUserHandler}>getUser</button>
      </div>
    </div>
  );
}