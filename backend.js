var express = require('express')
var app = express()
var mysql = require('mysql')

var con = mysql.createConnection({
	host: "localhost",
	user: "top4ek",
	password: "q2w3e4r5",
	database: "lesson"
})

con.connect(function(err){
	con.query("SELECT * FROM first", function(err, result, fields){
		console.log('Connection to database is successful')
	})
})

app.get('/', (req,res) => {
	res.send('Main page')
})

app.get('/reg', (req,res) => {
  var login = req.query.login
  var password = req.query.password
  con.query("SELECT login FROM first WHERE login ='"+login+"'", function(err, result, fields){
    if(result[0] == undefined){
      con.query("INSERT INTO first (login, password) VALUES ('" + login + "', '"+password+"')", function(err, result, fields){
        res.send('good')
      })
    }else{
      res.send('bad')
    }
	})
})

app.get('/login', (req, res) => {
  var login = req.query.login
  var password = req.query.password
  con.query("SELECT login, password, win, lose FROM first WHERE login = '"+login+"'", function(err,result,fields){
		if(result[0] !== undefined){
      var win = result[0].win
      var lose = result[0].lose
      res.send('login: '+login+',win: '+win+',lose: '+lose+'')
    }else{
      res.send('bad')
    }
	})
})

app.get('/game', (req, res) => {
  var login = req.query.login
  var tool = req.query.tool
  console.log(tool);
  /*
    who is win
    if user win => win + 1
    if computer win => lose + 1
    if withdraw => nothing
    con.query('UPDATE ...')
  */
  var result_of_game = 'win' // win or lose or withdraw
  res.send(result_of_game)
})

app.listen(1337, function(){
	console.log('Server started on port 1337')
})
