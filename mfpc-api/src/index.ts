import express from 'express';

process.on('SIGINT', () => process.exit(1));

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`⚡️ Server is running at https://localhost:${PORT}`);
});
