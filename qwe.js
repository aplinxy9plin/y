const Telegraf = require('Telegraf')
const Markup = require('Telegraf/markup')
const Extra = require('Telegraf/extra')

const bot = new Telegraf('520079015:AAEh2mKh1LpC_YSPmTn5JyMO0NQTUMWVNyQ')

var mysql=require('mysql')

var con = mysql.createConnection({
  host: "localhost",
  user: "top4ek",
  password: "q2w3e4r5",
  database: "lesson"
});

con.connect(function(err) {
  con.query("SELECT * FROM coffee", function (err, result, fields) {
    console.log('Connect to database is successful');
  });
});
bot.start((ctx)=>{
 var text = ctx.update.message.text
 ctx.reply(text)

})

bot.on('message', (ctx) =>{
 var message = ctx.update.message.text
 var chat_id = ctx.from.id

 con.query("SELECT chat_id, status FROM vk WHERE chat_id = "+chat_id, function(err,result,fields){
    if(err) throw err;
  if(result[0] == undefined){
   con.query("INSERT INTO vk (chat_id, status) VALUES ("+chat_id+", 'login_empty')", function(err, result){
    ctx.reply('Введи логин VK')
   })
  }else{
   var status = result[0].status


   switch(status){
    case 'login_empty':
       con.query("UPDATE vk SET login = "+message+" WHERE chat_id="+chat_id+"", function(err, result){
        if (err) throw err;
        ctx.reply('Ваш логин: '+message+'?', Markup
         .keyboard(['Да', "No"])
         .oneTime()
         .resize()
         .extra()
   )
})
      break;

    case 'password_empty':

     break;
    case 'some_case':

     break;
    default:

   }
}
})
})
bot.startPolling()
