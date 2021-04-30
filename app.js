const express = require('express')
const app = express()
const bodyParser = require("body-parser"); 
var Usermodel = require('../model/model'); 
var UserDetailsmodel = require('../model/userDetails'); 
var Referencemodel = require('../model/userDetails');
var FileUploadmodel = require('../model/userDetails');
const port = 3000
var multer = require('multer');
var upload = multer({ dest: '../files/' })
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
    }
  });
  
var uploadFiles = multer({ storage : storage }).array('uploadFiles',2);
app.post('/upload',upload.none(),function(req,res){
    uploadFiles(req,res,function(err) {
        console.log(req.body);
        //console.log(req.files);
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

var moment = require('moment');
moment().format('dd/mm/yyyy [at] h:mm a');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/optacredit', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected")
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { body, validationResult } = require('express-validator');

app.post('/login', 
        body('username').not().isEmpty().isEmail(),
        body('password').isLength({ min: 5 }),
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
            }
            
            Usermodel.find({username:req.body.username,password:req.body.password}, function(err, objs){
                if (objs.length == 1){
                    let userid = objs[0].id
                    Usermodel.findByIdAndUpdate(userid,{lastlogin:Date.now()})
                    console.log( typeof userid)
                    return res.status(200).send( {
                        "error":false,
                        "message": "login Successful",
                        "data":{
                            "username":req.body.username,
                            "last_login":moment(objs[0].lastlogin).format('D/mm/YY [at] h:mma')
                        }
                    });
                }else{
                    return res.status(400).send({
                        "error":true,
                        "message":err
                    })
                }
            })
        
}),

app.post('/create_user',upload.single('files'),
    body('username').not().isEmpty().isEmail(),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        console.log(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const userVerify = await Usermodel.find({username:req.body.username})
        if(userVerify.length>0){
            return res.status(400).send({
                "error":true,
                "message":"User name already taken"
            })
        }else{
            var newUser = new Usermodel();
            newUser.username = req.body.username;
            newUser.password = req.body.password;
            // newUser.profileImg.data = fs.readFileSync(req.files.profileImg.path)
            newUser.save(function(err, data){
                if(err){
                    console.log(error);
                }
                else{
                    return res.status(201).send({
                        "error":false,
                        "message":"Successfully created",
                        "data":{
                            "username":newUser.username
                        }
                    })
                }
            });
        }
    
});

app.get('/all_data', function(req, res) {
    
    Usermodel.find({}, function(err, data) {
        
        return res.status(200).send( {
            user : req.user,
            All_users: data
        });
    });
});

app.post('/new_application',
    body('fname').not().isEmpty(),
    body('lname').not().isEmpty(),
    body('dob').not().isEmpty(),
    body('phNumber').not().isEmpty(),
    body('tenure').not().isEmpty(),
    body('gender').not().isEmpty(),
    body('email').not().isEmpty().isEmail(),
    body('loanAmount').not().isEmpty(),
    body('aadhaarNumber').not().isEmpty(),
    body('voterId').not().isEmpty(),
    body('voterIdState').not().isEmpty(),
    body('permenantAddress').not().isEmpty(),
    body('permanentCity').not().isEmpty(),
    body('permanentState').not().isEmpty(),
    body('voterIdState').not().isEmpty(),
    body('empName').not().isEmpty(),
    body('ofcEmail').not().isEmpty().isEmail(),
    body('totalExp').not().isEmpty(),
    body('ofcPhone').not().isEmpty(),
    body('existDebt').not().isEmpty(),
    body('bankAcNo').not().isEmpty(),
    body('branchName').not().isEmpty(),
    body('ifsc').not().isEmpty(),
    body('bankName').not().isEmpty(),
    body('ref').not().isEmpty(),
    async (req, res) => {
        console.log(req.body)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        var newApp = new UserDetailsmodel();
        newApp.firstname=req.body.fname;
        newApp.lastname=req.body.lname;
        newApp.dob=req.body.dob;
        newApp.phNumber=req.body.phNumber;
        newApp.tenure=req.body.tenure;
        newApp.gender=req.body.gender;
        newApp.email=req.body.email;
        newApp.loanAmount=req.body.loanAmount;
        newApp.panNumber=req.body.panNumber;
        newApp.aadhaarNumber=req.body.aadhaarNumber;
        newApp.voterId=req.body.voterId;
        newApp.voterIdState=req.body.voterIdState;
        newApp.passport=req.body.passport;
        newApp.DLstate=req.body.DLstate;
        newApp.DL=req.body.DL;
        newApp.presentAddress=req.body.presentAddress;
        newApp.presentCity=req.body.presentCity;
        newApp.presentState=req.body.presentState;
        newApp.presentPin=req.body.presentPin;
        newApp.permenantAddress=req.body.permenantAddress;
        newApp.permanentCity=req.body.permanentCity;
        newApp.permanentState=req.body.permanentState;
        newApp.permenantPin=req.body.permenantPin;
        newApp.empName=req.body.empName;
        newApp.ofcEmail=req.body.ofcEmail;
        newApp.totalExp=req.body.totalExp;
        newApp.ofcPhone=req.body.ofcPhone;
        newApp.existDebt=req.body.existDebt;
        newApp.bankAcNo=req.body.bankAcNo;
        newApp.branchName=req.body.branchName;
        newApp.ifsc=req.body.ifsc;
        newApp.bankName=req.body.bankName;
        newApp.save(function(err, data){
            if(err){
                console.log(err);
            }
            else{
                for(let i=0;i<req.body['ref'].length;i++){
                    var newRef = new Referencemodel();
                    newRef.User.push(newApp.id)
                    newRef.refname=req.body['ref'][i]['refname'];
                    newRef.refaddress=req.body['ref'][i]['refaddress'];
                    newRef.refphone=req.body['ref'][i]['refphone'];
                    newRef.refcity=req.body['ref'][i]['refcity'];
                    newRef.refstate=req.body['ref'][i]['refstate'];
                    newRef.refpincode=req.body['ref'][i]['refpincode'];
                    newRef.save(function(err, data){
                        if(err){
                            console.log(err);
                        }
                    });
                }
                return res.status(201).send({
                    "error":false,
                    "message":"Successfully created",
                    "data":{
                        "username":newApp.fname
                    }
                })
            }
        });
    });  //5ffe992ae328353d75e663c5

app.get('/all_application', function(req, res) {

    UserDetailsmodel.find({}, function(err, data) {
        
        return res.status(200).send( {
            All_Application: data
        });
    });
});
app.get('/all_ref', function(req, res) {

    Referencemodel.find({}, function(err, data) {
        
        return res.status(200).send( {
            All_Reference: data
        });
    });
});
app.post('/test',  upload.single('avatar'),
    body('files').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.files)
        for(let i=0;i<req.body['files'].length;i++){
            console.log(req.body['files'][i])
            
        }

        return res.status(200).send({
            "error":false,
            "message":"successful"
        })
        
}),


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})