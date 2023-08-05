const express = require('express');
const fileUpload = require('express-fileupload');
var http = require('http');
const path = require('path');
const { pid } = require('process');
const QueryString = require('qs');
var sha256 = require('js-sha256');
const fetch = require('node-fetch')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(fileUpload());

var pID = 0;
var username = "";
app.post('/', async function(req, res) {
	if (req.body.username && req.body.password) {
    username = req.body.username;
  	let password = req.body.password;
    const re = await fetch("https://api.unrealkingdoms.com/auth/login", {method: 'POST',headers: {'Accept': 'application/json','Content-Type': 'application/json'},body: `{"email":"${username}","password":"${password}"}`});
    
    re.json();
    if(re.status != 200){
      res.render('login', {bad:true, p:pID});
    } else {
    res.render('image',{p:pID});
    }
	} else {
    if (req.body.title) {
      let title = req.body.title;
      let description = req.body.description;
      let url = req.body.url;
      let { image } = req.files;
      t = new Date().getTime();
      nm = sha256(image.name+t)+'.png';
      image.mv(__dirname + '/upload/' + nm);
      const re = await fetch("https://api.unrealkingdoms.com/panels/add", {method: 'POST',headers: {'Accept': 'application/json','Content-Type': 'application/json'},body: `{"id":"${pID}","texture":"${nm}","title":"${title}","description":"${description}","url":"${url}","owner":"${username}"}`});
      res.render('info', {m:"Success, you can close this window"});
    } else {
      res.render('login', {bad:false, p: pID});
    }
  }
});

app.get('/', async function(req, res) {
    if(req.query.p){
      pID = req.query.p;
      res.render('login', {bad:false, p:pID});}
    else
      res.render('info', {m:"Bad query, please try again later"});
});

app.get('/image', async function(req, res){
if(req.query.n)
res.sendFile(__dirname + '/upload/'+req.query.n);
else
res.send(404);
});

app.set('views', './views');
app.set('view engine', 'ejs');
app.listen(80);