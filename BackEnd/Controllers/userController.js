const UserModel = require('../Models/User');
const { createLog } = require('./logController');
const bcrypt = require('bcrypt');


async function listUsers(req, res) {
    try {
        const users = await UserModel.find();

        await createLog({
        action: 'listar_usuarios',
        message: 'Listagem de usuários realizada com sucesso',
        user: null
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (err) {
        await createLog({
        action: 'erro_listar_usuarios',
        message: `Erro ao listar usuários: ${err.message}`,
        user: null
        });
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao listar usuários' }));
    }
    }


async function createUser(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);

    req.on('end', async () => {
        try {
        const data = JSON.parse(body);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const newUser = await UserModel.create(data);

        await createLog({
            action: 'criar_usuario',
            message: `Usuário criado com email: ${data.email}`,
            user: newUser.id
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));

        } catch (err) {
        await createLog({
            action: 'erro_criar_usuario',
            message: `Erro ao criar usuário: ${err.message}`,
            user: null
        });
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao criar usuário' }));
        }
    });
    }


async function updateUser(req, res) {
    const id = req.url.split('/')[2];
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', async () => {
        try {
        const data = JSON.parse(body);

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true });

        await createLog({
            action: 'atualizar_usuario',
            message: `Usuário atualizado: ${id}`,
            user: id
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedUser));
        } catch (err) {
        await createLog({
            action: 'erro_atualizar_usuario',
            message: `Erro ao atualizar usuário ${id}: ${err.message}`,
            user: id
        });

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao atualizar usuário' }));
        }
    });
    }


async function deleteUser(req, res) {
    const id = req.url.split('/')[2];

    try {
        await UserModel.findByIdAndDelete(id);

        await createLog({
        action: 'deletar_usuario',
        message: `Usuário deletado: ${id}`,
        user: id
        });

        res.writeHead(204);
        res.end();
    } catch (err) {
        await createLog({
        action: 'erro_deletar_usuario',
        message: `Erro ao deletar usuário ${id}: ${err.message}`,
        user: id
        });

        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao deletar usuário' }));
    }
}

module.exports = {
    listUsers,
    createUser,
    updateUser,
    deleteUser
};