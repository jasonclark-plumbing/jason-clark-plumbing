import bcrypt from 'bcryptjs';

const password = 'StarCitizen1!';
const hash = '$2b$10$T.eA/WsKqi1/lUZqRll77OSub34gLb8L/k9Wub3fYKuhQPIkim8fa';

const isValid = await bcrypt.compare(password, hash);
console.log('Password valid:', isValid);
