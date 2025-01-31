import express from 'express';
import { usersRouter } from './users/users.js';

const port = '8000';
const app = express();

app.get('/hello', (req, res) => {
	res.send('Привет, мир');
});

app.use('/users', usersRouter);

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`)
});