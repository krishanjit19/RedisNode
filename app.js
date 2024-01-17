const express = require('express');
const bodyParser = require('body-parser');
const Redis = require('ioredis');

const app = express();
const port = 3000;

const redis = new Redis.Cluster([
  { host: '127.0.0.1', port: 7001 },
  { host: '127.0.0.1', port: 7002 },
  { host: '127.0.0.1', port: 7003 },
]);


app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Welcome to the Redis CRUD API!');
});


app.post('/put', (req, res) => {
    const { key, value } = req.body;

    if (!key || !value) {
        return res.status(400).send('Both key and value are required.');
    }

    redis.set(key, value)
        .then(() => res.send('Data added successfully'))
        .catch((err) => res.status(500).send(`Error adding data to Redis: ${err.message}`));
});


app.get('/get/:key', (req, res) => {
    const { key } = req.params;

    if (!key) {
        return res.status(400).send('Key parameter is required.');
    }

    redis.get(key)
        .then((result) => {
            if (result === null) {
                res.status(404).send(`Key "${key}" not found in Redis.`);
            } else {
                res.send(`Value for key "${key}": ${result}`);
            }
        })
        .catch((err) => res.status(500).send(`Error retrieving data from Redis: ${err.message}`));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
