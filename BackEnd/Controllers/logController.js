const LogModel = require('../Models/Log');


async function createLog(logData) {
  try {

    const newLog = await LogModel.create(logData);
    return newLog;

  } catch (err) {

    console.error('Erro ao criar log:', err.message);
    throw err;
  }
}


async function listLogs(req, res) {
  try {
    const logs = await LogModel.find().populate('user', 'name email');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(logs));
  } catch (err) {
    console.error('Erro ao listar logs:', err.message);

    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao listar logs' }));
  }
}

module.exports = {
  createLog,
  listLogs
};
