const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb')
const mongo = mongodb.MongoClient;

const port = process.argv.slice(2)[0];

const app = express();
app.use(bodyParser.json());

const db_url = "mongodb://localhost:27017/";    // TODO: Update url with URL of hosted database

app.post('/notifyUser', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        let notif = req.body.msg;

        if(notif && notif.type && notif.body) {
            dbo.collection('notifications').insertOne(notif, (err, doc) => {
                if(err) throw err;

                res.status(200).send();
            });
        }

        else {
            res.status(400).send("Invalid Packet");
        }
    });
});

app.get('/fetchNotifs', (req, res) => {

    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        dbo.collection('notifications').find({user_id: req.body.user_id}, (err, doc) => {
            if(err) throw err;

            res.status(200).send({notifs: doc.ops});
        });
    });
});