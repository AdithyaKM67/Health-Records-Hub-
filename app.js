const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'something', 
  resave:true,
  saveUninitialized: true
  
}));
/* mongodb+srv://kmadithya6:0KrHoD5VtdXxtMnv@cluster0.jlfhie9.mongodb.net/ */
mongoose.connect('mongodb+srv://kmadithya6:0KrHoD5VtdXxtMnv@cluster0.jlfhie9.mongodb.net/login');
/* mongoose.connect('mongodb://127.0.0.1:27017/login'); */
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
  });
const iteml=mongoose.model("first",userSchema);


const messageSchema=new mongoose.Schema({
    name:String,
    contactnumber:Number,
    message:String
});
const message1=mongoose.model("second",messageSchema);

const hospitalrecordSchema=new mongoose.Schema({
    patientid:String,
    treatmentname:String,
    description:String,
    costincurred:Number,
    dateoftreatment:Date,
    referencedoctor:String
});
const hospitalrecord1=mongoose.model("seventh",hospitalrecordSchema);

const labrecordSchema=new mongoose.Schema({
    patientid:String,
    scanningname:String,
    inference:String,
    costincurred:Number,
    dateofscanning:Date,
    referencenumber:String
});
const labrecord1=mongoose.model("eigth",labrecordSchema);

let redirectFlagHospital=false;
let redirectFlagLab=false;
let redirectFlagDoctor=false;
let redirectFlagAdmin = false;
let redirectFlagPatient=false;

const checkRedirectFlagHospital = (req, res, next) => {
  if (redirectFlagHospital) {
      next();
  } else {
      
      res.redirect('/login');
  }
};
const checkRedirectFlagLab = (req, res, next) => {
  if (redirectFlagLab) {
      next();
  } else {
      
      res.redirect('/login');
  }
};
const checkRedirectFlagAdmin = (req, res, next) => {
  if (redirectFlagAdmin) {
      next();
  } else {
      
      res.redirect('/login');
  }
};
const checkRedirectFlagDoctor = (req, res, next) => {
  if (redirectFlagDoctor) {
      next();
  } else {
      res.redirect('/login');
  }
};
const checkRedirectFlagPatient = (req, res, next) => {
  if (redirectFlagPatient) {
      next();
  } else {
      res.redirect('/login');
  }
};

app.get('/', (req, res) => {
    res.render('login');
  });
  app.get('/login', (req, res) => {
    res.render('login');
  });
  app.get('/patient',checkRedirectFlagPatient, async(req,res)=>{
    var username = req.session.profilename;
    var name=req.session.profilename2;
    records=await hospitalrecord1.find({patientid:username});
    labrecords=await labrecord1.find({patientid:username});
   res.render('patient',{username,name,records,labrecords});
  })
  app.get('/admin', checkRedirectFlagAdmin, async(req, res) => {
    messages1=await message1.find();
    res.render('admin',{messages1});
});
app.get('/doctor', checkRedirectFlagDoctor, async (req, res) => {
    var username = req.session.profilename;
    var name=req.session.profilename2;
  
  res.render('doctor',{username,name});
});
app.get('/lab', checkRedirectFlagLab, async (req, res) => {
  try {
    var username = req.session.profilename;
    var name=req.session.profilename2;
    res.render('lab',{username,name});
} catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
}
  
});
app.get('/hospital', checkRedirectFlagHospital, async (req, res) => {
  try {
    var username = req.session.profilename;
    var name=req.session.profilename2;
    /* requests = await datal.find().lean(); */ 
   res.render('hospital',{username,name} /* { requests } */);
} catch (error) {
   console.error('Error fetching user data:', error);
   res.status(500).send('Internal Server Error');
}
});
app.get('/help',async(req,res)=>{
    try{
        res.render('help');
    }
    catch(error){
        console.error('Error:', error);
        res.status(500).send('Help Page error');
    }
})

app.post("/login",function(req,res){
    const User2=new iteml({
      username:req.body.username2,
      password:req.body.password2,
      role:req.body.role2
    })
    switch(User2.role){
      case "Admin":
                if((User2.username=="admin")&& (User2.password=="admin") ){
                  redirectFlagAdmin = true;
                  res.redirect('/admin');
                }else{
                     console.log("Invalid User");
                    }
                break;
        case "Patient":
            iteml.findOne({ username: User2.username ,role:User2.role})
            .then(foundUser => {
              if (foundUser) {
                if (foundUser.password === User2.password) {
                  
                  var profilename= User2.username;
                   req.session.profilename = profilename;
                   var profilename2=User2.password;
               req.session.profilename2 = profilename2;
                  redirectFlagPatient=true;
                  res.redirect("/patient");
                }
              }
              else{
                console.log("Invalid User");
              }
            })
            .catch(err => {
              console.log(err);
            });
            break;
                     
    case "Doctor":
        iteml.findOne({ username: User2.username ,role:User2.role})
        .then(foundUser => {
          if (foundUser) {
            if (foundUser.password === User2.password) {
              
              var profilename= User2.username;
               req.session.profilename = profilename;
               var profilename2=User2.password;
               req.session.profilename2 = profilename2;
              redirectFlagDoctor=true;
              res.redirect("/doctor");
            }
          }
          else{
            console.log("Invalid User");
          }
        })
        .catch(err => {
          console.log(err);
        });
        break;

      case "Lab":
        iteml.findOne({ username: User2.username ,role:User2.role})
            .then(foundUser => {
              if (foundUser) {
                if (foundUser.password === User2.password) {
                  
                  var profilename= User2.username;
                   req.session.profilename = profilename;
                   var profilename2=User2.password;
               req.session.profilename2 = profilename2;
                  redirectFlagLab=true;
                  res.redirect("/lab");
                }
              }
              else{
                console.log("Invalid User");
              }
            })
            .catch(err => {
              console.log(err);
            });
            break;
      case "Hospital":
        iteml.findOne({ username: User2.username ,role:User2.role})
            .then(foundUser => {
              if (foundUser) {
                if (foundUser.password === User2.password) {
                  
                  var profilename= User2.username;
                   req.session.profilename = profilename;
                   var profilename2=User2.password;
               req.session.profilename2 = profilename2;
                  redirectFlagHospital=true;
                  res.redirect("/hospital");
                }
              }
              else{
                console.log("Invalid User");
              }
            })
            .catch(err => {
              console.log(err);
            });
            break;
       }
  });
  
  app.post("/admin",function(req,res){
    const User3=new iteml({
      username:req.body.username2,
      password:req.body.password2,
      role:req.body.role2
    })
    console.log(req.body.role2)
    User3.save();
    res.redirect('/admin');
    console.log("registered user");
  });

  app.post('/lab',(req,res)=>{
  
    const newData=new labrecord1({
      patientid:req.body.patientid,
      scanningname:req.body.scanningname,
      inference:req.body.inference,
      costincurred:req.body.costincurred,
      dateofscanning:req.body.dateofscanning,
       referencenumber: req.body.referencenumber
    });
    newData.save();
    res.redirect("/lab");
    console.log("Added lab record");
  })

  app.post('/hospital',(req,res)=>{
  
    const newData=new hospitalrecord1({
      patientid:req.body.patientid,
      treatmentname:req.body.treatmentname,
      description:req.body.description,
      costincurred:req.body.costincurred,
      dateoftreatment:req.body.dateoftreatment,
       referencedoctor: req.body.referencedoctor
    });
    newData.save();
    res.redirect("/hospital");
    console.log("Added hospital record");
  })
  

  app.post('/help',(req,res)=>{
  
    const newData=new message1({
      name:req.body.name,
      contactnumber:req.body.contactnumber,
      message:req.body.message
    });
    newData.save();
    res.redirect("/help");
    console.log("Added message");
  })

 app.post('/doctor',(req,res)=>{
                var profilename= req.body.patientId;
                   req.session.profilename = profilename;
               res.redirect('/doctorrecords');
 })
 app.get('/doctorrecords', async (req, res) => {
    try {
      var username = req.session.profilename;
      records=await hospitalrecord1.find({patientid:username});
      labrecords=await labrecord1.find({patientid:username});
      res.render('doctorrecords',{username,records,labrecords});
  } catch (error) {
     console.error('Error fetching user data:', error);
     res.status(500).send('Internal Server Error');
  }
  });


app.listen(port, () => {
    console.log('Server is running');
  });