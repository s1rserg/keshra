const turnUsername = import.meta.env.VITE_TURN_USERNAME;
const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;

export const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:stun.relay.metered.ca:80',
    },
    {
      urls: 'turn:standard.relay.metered.ca:80',
      username: turnUsername,
      credential: turnCredential,
    },
    {
      urls: 'turn:standard.relay.metered.ca:80?transport=tcp',
      username: turnUsername,
      credential: turnCredential,
    },
    {
      urls: 'turn:standard.relay.metered.ca:443',
      username: turnUsername,
      credential: turnCredential,
    },
    {
      urls: 'turns:standard.relay.metered.ca:443?transport=tcp',
      username: turnUsername,
      credential: turnCredential,
    },
  ],
};
