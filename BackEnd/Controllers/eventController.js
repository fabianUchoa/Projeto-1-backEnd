const EventModel = require('../Models/Event');
const { createLog } = require('./logController');


async function createEvent(req, res) {
  let body = '';
  let data = null;
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      data = JSON.parse(body);

      if (!data.title || !data.date || !data.user) {
        await createLog({
        action: 'erro_criar_evento',
        message: `Erro ao criar evento: Campos obrigatórios faltando.`,
        user: data.user._id
      });
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Campos obrigatórios faltando' }));
      }

      const newEvent = await EventModel.create(data);
      await createLog({
        action: 'criar_evento',
        message: `Evento criado: ${data.title}`,
        user: data.user._id
      });

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newEvent));
    } catch (err) {
      await createLog({
        action: 'erro_criar_evento',
        message: `Erro ao criar evento: ${err.message}`,
        user: data.user._id
      });
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro ao criar evento' }));
    }
  });
}


async function listEvents(req, res, userId) {
    try {

        
        const events = await EventModel.find({ user: userId  }).populate('user', 'name email');

        await createLog({
            action: 'listar_eventos',
            message: `Eventos listados com sucesso.`,
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




async function deleteEvent(req, res, id) {
    try {
    
    const Event = await EventModel.findById(id);
    userId = Event.user;
    await EventModel.findByIdAndDelete(id);
    console.log(userId);
    await createLog({
      action: 'deletar_evento',
      message: `Evento deletado: ${id}`,
      user: userId
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Evento deletado com sucesso' }));
  } catch (err) {
    await createLog({
      action: 'erro_deletar_evento',
      message: `Erro ao deletar evento: ${err.message}`,
      user: userId._id
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
