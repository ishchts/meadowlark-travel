import credentialsDev from './.credentials.development.json';
const env = process.env.NODE_ENV || 'development';
const path = `./.credentials.${env}`;

export const credentials = credentialsDev;
