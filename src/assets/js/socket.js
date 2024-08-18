// socket.js
import { io } from 'socket.io-client';

const serverUrl =
  import.meta.env.VITE_NODE_ENV === 'dev'
    ? 'http://localhost:3000'
    : 'https://bens-api-dd63362f50db.herokuapp.com';

const socket = io(serverUrl, { withCredentials: true });

export default socket;