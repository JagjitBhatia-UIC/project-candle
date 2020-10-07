const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

const port = process.argv.slice(2)[0];

const app = express();
app.use(bodyParser.json());

const db_url = "mongodb://localhost:27017/";    // TODO: Update url with URL of hosted database

// Sign Up API
app.post('/signup', (req, res) => {
    let _username = req.body.username;
    let _password = req.body.password;

    mongo.connect(db_url, (err, db) => {
        if(err) throw err;
        
        let dbo = db.db('candleDB');

        dbo.collection('users').findOne({username: _username}, (err, result) => {
            if(err) throw err;
            
            if(result) {
                res.status(400).send("Username taken!");
                db.close();
            }

            else {
                bcrypt.hash(_password, 10, (err, hash) => {
                    if(err) throw err;

                    let new_user = {username: _username, pwd_hash: hash};

                    dbo.collection('users').insertOne(new_user, (err, doc) => {
                        if(err) throw err;
                        res.status(202).send({user_id: doc.ops[0]._id});
                        db.close();
                    });
                });
            }

        });
    });
 
});


// Login API
app.post('/login', (req, res) => {
    let _username = req.body.username;
    let _password = req.body.password;

    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        dbo.collection('users').findOne({username: _username}, (err, result) => {
            if(err) throw err;

            if(!result) {
                res.status(401).send("Invalid username and password combination!");
                db.close();
            }

            else {
                bcrypt.compare(_password, result.pwd_hash, (err, match) => {
                    if(err) throw err;

                    if(!match) {
                        res.status(401).send("Invalid username and password combination!");
                        db.close();
                    }

                    else {
                        res.status(202).send({user_id: result._id});
                        db.close();
                    }
                });
            }
        });
        
    })
});


app.listen(port);