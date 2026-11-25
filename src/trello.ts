
import 'dotenv/config';

const API_URL = 'https://api.trello.com/1';
const apiKey = getRequiredEnv('TRELLO_API_KEY');
const token = getRequiredEnv('TRELLO_TOKEN');

if (!apiKey || !token) {
  throw new Error('Trello API Key ou Token não configurado.');
}

export async function trelloRequest<T>(
  endpoint: string,
  params: Record<string, string> = {},
  method: 'GET' | 'POST' = 'GET'
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);

  url.searchParams.set('key', apiKey);
  url.searchParams.set('token', token);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, { method });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Trello API error: ${response.status} - ${error}`);
  }

  return response.json() as Promise<T>;
}


function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável ${name} não configurada.`);
  }

  return value;
}


