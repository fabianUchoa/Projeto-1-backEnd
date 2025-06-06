const http = require('http');
const mongoose = require('mongoose');
const router = require('./Routes/router');
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/agenda', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conectado ao MongoDB');

  const server = http.createServer((req, res) => {
  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    router(req, res);
  });

  server.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
  });
})
.catch(err => {
  console.error(' Erro ao conectar ao MongoDB:', err);
});