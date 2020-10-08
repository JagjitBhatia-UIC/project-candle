const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;

const port = process.argv.slice(2)[0];

const app = express();
app.use(bodyParser.json());

const db_url = "mongodb://localhost:27017/";    // TODO: Update url with URL of hosted database

// Create Profile API
app.post('/createProfile', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        new_profile = {
            user_id: req.body.user_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            pic_url: req.body.pic_url,
            institution: req.body.institution
        }

        dbo.collection('profiles').insertOne(new_profile, (err, doc) => {
            if(err) throw err;

            res.status(200).send({profile: doc.ops[0]});
            db.close();
        });

    });
});

// Get Profile API
app.get('/getProfile', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        dbo.collection('profiles').findOne({user_id: req.query.user_id}, (err, result) => {
            res.status(200).send(result);
            db.close();
        });
    });
});


app.listen(port);