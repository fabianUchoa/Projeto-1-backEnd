const userController = require('../Controllers/userController');
const eventController = require('../Controllers/eventController');
const logController = require('../Controllers/logController')
const authController = require('../Auth/authController')


function router(req, res) {
    const { method, url } = req;
    

    if (method === 'GET' && url === '/users') {
        return userController.listUsers(req, res);
    }

    if (method === 'PUT' && url === '/users/:id') {
        return userController.editUser(req, res);
    }

    if (method === 'DELETE' && url === '/users/:id') {
        return userController.deleteUser(req, res);
    }

    if (method === 'POST' && url === '/new-user') {
        return userController.createUser(req, res);
    }

    if (method === 'GET' && url === ':id/events') {
        return eventController.listEvents(req, res);
    }

    if (method === 'POST' && url === '/new-event') {
        return eventController.createEvent(req, res);
    }

    if (method === 'DELETE' && url === '/events/:id') {
        return eventController.deleteEvent(req, res);
    }

    if (method === 'POST' && url === '/logs') {
        return logController.createLog(req, res);
    }

    if (method === 'GET' && url === '/logs') {
        return logController.listLogs(req, res);
    }

    if(method === 'POST' && url === '/login'){
        return authController.login(req, res);
    }


    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Rota não encontrada' }));
}

    module.exports = router;
