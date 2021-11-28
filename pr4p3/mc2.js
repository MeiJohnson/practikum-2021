const MicroMQ = require('micromq');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

resultList = [];


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
    console.log(req.body);
    console.log(req.query);
    const { a, b } = req.query;
    let s = (a * b) / 2;

    res.json([{
        answer: s
    }]);
});

app.post('/trap-file', (req, res) => {
    console.log(req.query);
    const { a, b, h } = req.query;
    const s = ((a + b) / 2) * h;
    const calcUuid = uuidv4();
    fs.access("result.txt", function(error) {
        if (error) {
            console.log("Файл не найден");
            fs.writeFile("result.txt", `{"uuid":"${calcUuid}", "answer": ${s}}`, function(error) {
                if (error) throw error;
            });
        } else {
            console.log("Файл найден");
            fs.appendFile("result.txt", `,{"uuid":"${calcUuid}", "answer": ${s}}`, function(error) {
                if (error) throw error;
            });
        }
    });
    res.json([{
        answer: s
    }]);
});

app.post('/trap-update', (req, res) => {
    console.log(req.query);
    const { guid, a, b, h } = req.query;
    console.log(guid);
    let updateStatus = false;
    fs.readFile('result.txt', function(err, data) {
        if (err) { console.log(err); throw err; } else {
            const stringRes = data.toString();
            const stringResArr = '[' + stringRes + ']';
            const jsonArray = JSON.parse(stringResArr);

            jsonArray.forEach(el => {
                if (el.uuid === guid) {
                    el.answer = ((a + b) / 2) * h;
                    updateStatus = true;
                    const stringyArr = JSON.stringify(jsonArray)
                    readyToWriteStr = stringyArr.slice(1, stringyArr.length - 1);
                    fs.writeFile("result.txt", readyToWriteStr, function(error) {
                        if (error) throw error;
                    });
                    res.json({
                        "Status": updateStatus
                    });
                }
            });
            console.log(1, updateStatus);
        }
    });

});

app.post('/trap-delete', (req, res) => {

    console.log(req.query);
    const { guid } = req.query;
    console.log(guid);
    let updateStatus = false;

    fs.readFile('result.txt', function(err, data) {
        if (err) { console.log(err); throw err; } else {
            const stringRes = data.toString();
            const stringResArr = '[' + stringRes + ']';
            const jsonArray = JSON.parse(stringResArr);

            jsonArray.forEach(el => {
                if (el.uuid === guid) {
                    jsonArray.splice(jsonArray.indexOf(el), 1);
                    console.log(jsonArray);
                    updateStatus = true;
                    const stringyArr = JSON.stringify(jsonArray)
                    readyToWriteStr = stringyArr.slice(1, stringyArr.length - 1);
                    fs.writeFile("result.txt", readyToWriteStr, function(error) {
                        if (error) throw error;
                    });
                    res.json({
                        "Status": updateStatus
                    });
                }
            });
            console.log(1, updateStatus);
        }
    });

});
app.start();

// docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management