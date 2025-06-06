const User = require('../Models/User');
const bcrypt = require('bcrypt');

const {createLog} = require('../Controllers/logController');




async function login(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
        const { email, password } = JSON.parse(body);

        
        const user = await User.findOne({ email });
            if (!user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuário não encontrado' }));
            }
        
        const senhaValida = await bcrypt.compare(password, user.password);
        if (!senhaValida) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Senha inválida' }));
        }

        try {
            await createLog({
                user: user._id,
                action: 'login',
                message: 'Usuário logado com sucesso'
            });
        } catch (logErr) {
            console.error('Erro ao registrar log:', logErr.message);
        }

        res.end(JSON.stringify(user));

        } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro no login' }));
        }
    });
}

module.exports = { login };
