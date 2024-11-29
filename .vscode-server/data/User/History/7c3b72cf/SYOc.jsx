import axios from 'axios';

const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-url/'
  : 'https://your-development-url/';

export const createSession = async (sessionId) => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}api/sessions`,
    { customSessionId: sessionId },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export const createToken = async (sessionId) => {
  const response = await axios.post(
    `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
    {},
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};
