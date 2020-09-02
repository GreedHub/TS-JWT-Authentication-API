import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import { AppConfig } from './require/config/AppConfig';
import { LoginManager } from './require/classes/LoginManager';
import { tokenRouter } from './require/routes/token';
import { authenticationRouter } from './require/routes/authentication';

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['192.168.0.131:9092']
})

const app = express();
app.use(bodyParser.json({limit: '100mb',parameterLimit: 100000, extended: true})); // support json encoded bodies
app.use(bodyParser.urlencoded({limit: '100mb',parameterLimit: 100000, extended: true})); // support encoded bodies
app.use(cookieParser());
app.use(cors());
app.use(tokenRouter);
app.use(authenticationRouter);

app.get('/kafka',async(req,res)=>{


    const producer = kafka.producer()

    await producer.connect()
    await producer.send({
    topic: 'test-topic',
    messages: [
        { value: 'Hello KafkaJS user!' },
    ],
    })

    const consumer = kafka.consumer({ groupId: 'test-group' })

await consumer.connect()
await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      value: message.value.toString(),
    })
  },
})
})

app.get('/private', async(req,res)=>{

    let {token} = req.cookies;

    let loginManager = new LoginManager();

    let loginResponse = await loginManager.privatePath(token)
        .catch(err=>{
            res.status(200).send(err);;
        })

    res.status(200).send(loginResponse);


});

app.listen(AppConfig.api.exposedPort,()=>{
    console.log(`Server started in http://localhost:${AppConfig.api.exposedPort}/`)
})