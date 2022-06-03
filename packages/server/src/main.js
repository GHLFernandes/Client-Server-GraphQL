import express from 'express';
import cors from 'cors';

const server = express();

//server.use(cors()); uma forma global de resolver o erro de cors

server.get('/status', (_, res) => {
    res.send({
        status: 'Ok',
    });
});

const enableCors = cors({ origin: 'http://localhost:3000' }); //uma das melhores forma de resolver o erro de cors

server.options('/auth', enableCors)
    .post('/auth', enableCors, express.json(), (req, res) => {
        console.log(
            'E-mail:', req.body.email,
            '\nSenha:', req.body.pass
        );

        res.send({
            Okay: true,
        });
    })

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server is listening at http://${HOSTNAME}:${PORT}`);
})