const userController = require('../Controllers/userController');
const eventController = require('../Controllers/eventController');
const logController = require('../Controllers/logController')
const authController = require('../Auth/authController')
const { parse } = require('url');

function router(req, res) {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const { method } = req;
    if (method === 'GET' && pathname === '/users') {
        return userController.listUsers(req, res);
    }

    if (method === 'DELETE' && pathname === '/users/:id') {
        return userController.deleteUser(req, res);
    }

    if (method === 'POST' && pathname === '/new-user') {
        return userController.createUser(req, res);
    }

    if (method === 'GET' && pathname === '/user/events') {
        const userId = query.userId;
        return eventController.listEvents(req, res, userId);
    }

    if (method === 'POST' && pathname === '/new-event') {
        return eventController.createEvent(req, res);
    }

    if (method === 'DELETE' && pathname === '/events/delete') {
        const eventId = query.eventId;
        return eventController.deleteEvent(req, res, eventId);
    }

    if (method === 'POST' && pathname === '/logs') {
        return logController.createLog(req, res);
    }

    if (method === 'GET' && pathname === '/logs') {
        return logController.listLogs(req, res);
    }

    if(method === 'POST' && pathname  === '/login'){
        return authController.login(req, res);
    }


    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Rota não encontrada' }));
}

    module.exports = router;
