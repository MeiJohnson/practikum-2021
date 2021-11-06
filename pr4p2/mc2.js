const MicroMQ = require('micromq');

const app = new MicroMQ({
    name: 'test',
    rabbit: {
        url: process.env.RABBIT_URL,
    },
});

app.post('/hello', (req, res) => {
    res.json([{
        answer: 'Hello world!'
    }]);
});

app.post('/neko', (req, res) => {
    res.json([{
        url: 'https://static.zerochan.net/Syun.%28GARPIKE%29.full.3493040.jpg'
    }]);
});

app.post('/romb', (req, res) => {
    console.log(req.query);
    const { a, b } = req.query;
    let s = (a * b) / 2;
    res.json([{
        answer: s
    }]);
});

app.start();