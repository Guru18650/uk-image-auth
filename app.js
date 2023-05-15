const express = require('express');
const fileUpload = require('express-fileupload');
var http = require('http');
const path = require('path');
const QueryString = require('qs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(fileUpload());

app.post('/', async function(req, res) {
	if (req.body.username && req.body.password) {
    let username = req.body.username;
  	let password = req.body.password;
    const re = await fetch("https://api.unrealkingdoms.com/v1/login", {method: 'POST',headers: {'Accept': 'application/json','Content-Type': 'application/json'},body: `{"email":"${username}","password":"${password}"}`});
    re.json();
    if(re.status != 200){
      res.render('login', {bad:true});
    } else {
    res.render('image');
    }
	} else {
    if (req.body.title) {
      let title = req.body.title;
      let description = req.body.description;
      let url = req.body.url;
      let { image } = req.files;
      image.mv(__dirname + '/upload/' + image.name);
    } else {
      res.render('login', {bad:false});
    }
  }
});

app.get('/', async function(req, res) {
    res.render('image', {bad:false});
});

app.set('views', './views');
app.set('view engine', 'ejs');
app.listen(80);