const EventModel = require('../Models/Event');
const { createLog } = require('./logController');


function createEvent(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);

      if (!data.title || !data.date || !data.user) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Campos obrigatórios faltando' }));
      }

      const newEvent = await EventModel.create(data);

      await createLog({
        action: 'criar_evento',
        message: `Evento criado: ${data.title}`,
        user: data.user.id
      });

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newEvent));
    } catch (err) {
      await createLog({
        action: 'erro_criar_evento',
        message: `Erro ao criar evento: ${err.message}`,
        user: data.user.id
      });
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao criar evento' }));
    }
  });
}


async function listEvents(req, res) {
  try {
    
    const url = req.url;
    const userId =  url.split('/')[0];

    if (!userId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'userId é obrigatório na query string' }));
    }

    
    const events = await EventModel.find({ user: userId }).populate('user', 'name email');

    await createLog({
        action: 'erro_listar_eventos',
        message: `Erro ao listar eventos: ${err.message}`,
        user: userId
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(events));
  } catch (err) {
    await createLog({
      action: 'erro_listar_eventos',
      message: `Erro ao listar eventos: ${err.message}`,
      user: userId
    });
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao listar eventos' }));
  }
}



async function deleteEvent(req, res) {
  const id = req.url.split('/')[2];
  try {
    await EventModel.findByIdAndDelete(id);

    await createLog({
      action: 'deletar_evento',
      message: `Evento deletado: ${id}`,
      user: id
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Evento deletado com sucesso' }));
  } catch (err) {
    await createLog({
      action: 'erro_deletar_evento',
      message: `Erro ao deletar evento: ${err.message}`,
      user: id
    });
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao deletar evento' }));
  }
}

module.exports = {
  listEvents,
  createEvent,
  deleteEvent
};
