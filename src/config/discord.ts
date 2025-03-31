const DISCORD_CLIENT_ID = '1330564254822043761';

const discord = {
  clientId: DISCORD_CLIENT_ID,
  redirectUri: 'https://api.niveles.xyz/auth/callback',
  oauthUrl: `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    'https://api.niveles.xyz/auth/discord/callback'
  )}&response_type=code&scope=identify%20guilds`
};

export default discord; 