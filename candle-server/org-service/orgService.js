const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const mongo = mongodb.MongoClient;
const amqp = require('amqplib/callback_api');
const axios = require('axios');

const port = process.argv.slice(2)[0];

const app = express();
app.use(bodyParser.json());

const db_url = "mongodb://localhost:27017/";    // TODO: Update url with URL of hosted database (e.g. AWS, MongoDB Atlas)
const mq_url = "amqp://localhost";
const userService_url = "";

// Get All Orgs API
app.get('/getAllOrgs', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        dbo.collection('orgs').find({}).toArray((err, result) => {
            if(err) throw err;

            res.status(200).send({orgs: result});
            db.close();
        })
    });
});

// Create Org API
app.post('/createOrg', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        new_profile = {
            name: req.body.name,
            logo_url: req.body.logo_url,
            bio: req.body.bio,
            institution: req.body.institution,
            members: [{id: req.body.user_id, role: 'admin', title: req.body.title || ''}],
            requests: [],
            public: req.body.public,       // If this is set to true, then anyone can join
            join_key: req.body.join_key || uuidv4()   // Allows requestor to auto-join without permission
            
        }

        dbo.collection('orgs').insertOne(new_profile, (err, doc) => {
            if(err) throw err;

            res.status(200).send({org: doc.ops[0]});
            db.close();
        });
    });
});

// Add member API
app.put('/addMember', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if(err) {
            console.log("Cannot connect to mongo!");
            throw err;
        }

        let dbo = db.db('candleDB');

        //request -- userid of member adding, userid of new member, id of org, role of new member

        dbo.collection('orgs').findOne({_id: new mongodb.ObjectId(req.body.org_id)}, (err, result) => {
            if(err) throw err;

            if(!result) {
                res.status(400).send("Organization does not exist.");
                db.close();
            }

            else {
                authorized = true;

                if(req.body.role == 'admin' || req.body.role == 'contributor') {
                    authorized = (result.members.find(member => (member.id == req.body.user_id && member.role == 'admin')) != null);
                }

                if(req.body.role == 'member') {
                    authorized = (result.members.find(member => (member.id == req.body.user_id && (member.role == 'admin' || member.role == 'contributor'))) != null);
                    authorized |= (req.body.join_key == result.join_key)
                }

                if(!authorized) {
                    res.status(401).send("You are not authorized to add this member.");
                    db.close();
                }

                else {
                    let filter = {_id: new mongodb.ObjectId(req.body.org_id)};
                    let query = { $push: { members: {id: req.body.newMember_id, role: req.body.role, title: req.body.title || ''} } };

                    dbo.collection('orgs').updateOne(filter, query, (err, record) => {
                        if(err) throw err;
                        res.status(202).send("Member successfully added!");
                       
                
                        let query2 = { $pull: { requests: {id: req.body.newMember_id} } };
                        dbo.collection('orgs').updateOne(filter, query2, (err, removed) => {
                            if(err) throw err;

                            else {
                                    if(removed.ops) console.log("Request for User ", req.body.newMember_id, " deleted!");
                            }
                            db.close();
                        });
                
                       
                    });
                }
            }
        });
    });
});


// Join Org API
app.put('/joinOrg', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        dbo.collection('orgs').findOne({_id: new mongodb.ObjectId(req.body.org_id)}, (err, result) => {
            if(err) throw err;

            if(!result) {
                res.status(400).send("Organization does not exist.");
                db.close();
            }
            

            // Check to see if org is either public or if user provides correct join key
            if(result.public || req.body.join_key == result.join_key) {
                res.redirect(307, '/addMember');
            }

            else {
                let filter = {_id: new mongodb.ObjectId(req.body.org_id)};
                let query = { $push: { requests: {id: req.body.newMember_id, role: req.body.role, title: req.body.title || ''} } };

                dbo.collection('orgs').updateOne(filter, query, (err, result) => {
                    if(err) throw err;
                    res.status(202).send(result);
                    db.close();
                });
            }

        });
    }); 
}); 


app.listen(port);