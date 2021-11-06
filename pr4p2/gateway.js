const Gateway = require('micromq/gateway');
const app = new Gateway({
    // названия микросервисов, к которым мы будем обращаться
    microservices: ['users', 'test'],
    rabbit: {
        // ссылка для подключения к rabbitmq (default: amqp://guest:guest@localhost:5672)
        url: process.env.RABBIT_URL,
    },
});
app.get(['/friends', '/status'], async(req, res) => {
    // делегируем запрос в микросервис users
    await res.delegate('users');
});

app.post(['/hello', '/neko', '/romb'], (req, res) => res.delegate('test'));

app.listen(process.env.PORT || 8080);