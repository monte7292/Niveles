import axios from 'axios';

export const authenticateWithDiscord = async () => {
  try {
    window.location.href = 'http://localhost:5001/auth/discord'; // Redirect to Discord OAuth
  } catch (error) {
    console.error('Error al autenticar con Discord:', error);
  }
};
