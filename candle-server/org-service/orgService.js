const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;

const port = process.argv.slice(2)[0];

const app = express();
app.use(bodyParser.json());

const db_url = "mongodb://localhost:27017/";    // TODO: Update url with URL of hosted database

// Create Org API
app.post('/createOrg', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if(err) throw err;

        let dbo = db.db('candleDB');

        new_profile = {
            user_id: req.body.user_id,
            name: req.body.name,
            logo_url: req.body.logo_url,
            bio: req.body.bio,
            institution: req.body.institution,
            members: [{id: req.body.user_id, role: 'admin', title: req.body.title || ''}]   
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
        if(err) throw err;

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
                }

                if(!authorized) {
                    res.status(401).send("You are not authorized to add this member.");
                    db.close();
                }

                else {
                    let filter = {_id: new mongodb.ObjectId(req.body.org_id)};
                    let query = { $push: { members: {id: req.body.newMember_id, role: req.body.role, title: req.body.title || ''} } };

                    dbo.collection('orgs').updateOne(filter, query, (err, result) => {
                        if(err) throw err;
                        res.status(202).send("New member added.");
                        db.close();
                    });
                }
            }
        });
    });
});


app.listen(port);