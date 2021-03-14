// Description: Microservice for managing user and account information (e.g. notifications, roles/orgs)
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb')
const mongo = mongodb.MongoClient;

const port = process.argv.slice(2)[0];

const app = express();
app.use(bodyParser.json());

const db_url = "mongodb://localhost:27017/";    // TODO: Update url with URL of hosted database

// GET getAllMemberships
// -- retrieve all memberships in orgs

app.get('/getAllMemberships', (req, res) => {
    mongo.connect(db_url, (err, db) => {
        if (err) throw err;

        let dbo = db.db('candleDB');
        
        dbo.collection('orgs').find({members : {$elemMatch: {id: req.query.user_id} }}).toArray((err, result) => {
            if(err) throw err;

            //Format output -- {org: (org object), membership: (membership object)}
            let _memberships = []
            let _org = {};
            let member;
            
            result.forEach(elem => {
                {
                    _org.id = elem._id; 
                    _org.name = elem.name;
                    _org.bio = elem.bio;
                    _org.institution = elem.institution;
                    
                    let member = elem.members.find(member => member.id == req.query.user_id);
                    
                    _memberships.push({org: _org, membership: member});
                }
            }); 

            res.status(200).send({memberships: _memberships});
            db.close();
        })




    });
});

// POST inviteUser
// -- add join request {newMember_id, org_id, role, title join_key} to request queue
// -- send notification to user of type JOIN_REQUEST

// DELETE acceptInvite
// -- delete join request from request queue
// -- call org-service/joinOrg <= (request obj)

// POST notifyUser
// -- send notification to user

// POST notifyMultiUser
// -- send notifications to each user in users array

app.listen(port);