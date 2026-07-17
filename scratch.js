import jwt from 'jsonwebtoken';
const token = jwt.sign({ id: '60d0fe4f5311236168a109ca', email: 'test@example.com', role: 'MEMBER' }, 'supersecretjwtkey', { expiresIn: '1h' });
console.log(token);
