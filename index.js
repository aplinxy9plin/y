const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
var vktoken = require('vk-token-FIXED')
var VK = require('vkapi');
var vk = new VK({'mode' : 'oauth'});

var mysql = require('mysql')

var con = mysql.createConnection({
  host: "localhost",
  user: "top4ek",
  password: "q2w3e4r5",
  database: "lesson"
});

con.connect(function(err) {
  con.query("SELECT * FROM vk", function (err, result, fields) {
    console.log('Connect to database is successful');
  });
});

const bot = new Telegraf('520079015:AAEh2mKh1LpC_YSPmTn5JyMO0NQTUMWVNyQ')

bot.start((ctx) => {
	var text = ctx.update.message.text
	ctx.reply(text)
})

global.chat_id = ''


bot.on('message', (ctx) =>{
	var message = ctx.update.message.text
	var chat_id = ctx.from.id
  global.chat_id = chat_id

	con.query("SELECT chat_id, status, login, password, token FROM vk WHERE chat_id = "+chat_id, function(err,result,fields){
		if(err) throw err;
		if(result[0] == undefined){
			con.query("INSERT INTO vk (chat_id, status) VALUES ("+chat_id+", 'login_empty')", function(err, result){
				ctx.reply('Введи логин VK')
			})
		}else{
			var status = result[0].status
			switch(status){
				case 'login_empty':
          if(message == 'Да' || message == 'Нет'){
            if (result[0].login !== undefined) {
              ctx.reply('Теперь введи пароль VK')
              updateStatus('password_empty')
            }else{
              ctx.reply('Введи логин VK')
            }
          }else{
  					con.query("UPDATE vk SET login = '"+message+"' WHERE chat_id = "+chat_id, function(err, result){
  						if(err) throw err;
  						ctx.reply('Ваш логин: '+message+' ?', Markup
  							.keyboard(['Да','Нет'])
  							.oneTime()
  							.resize()
  							.extra()
  						)
  					})
          }
					break;
				case 'password_empty':
          if(message == 'Да' || message == 'Нет'){
            if (result[0].login !== undefined) {
              //ctx.reply('Теперь введи пароль VK')
              //updateStatus('check_data')
              vktoken.getAccessToken(result[0].login, result[0].password, function(error, token){
                console.log(token);
                if(token !== 'notoken'){
                  con.query("UPDATE vk SET token = '"+token+"', status = 'message_sender' WHERE chat_id = "+chat_id)
                  ctx.reply('Вход успешен! Отправляй сообщения: ')
                }else{
                  ctx.reply('Логин или пароль неверный. Введите логин:')
                  updateStatus('login_empty')
                }
              })
            }else{
              ctx.reply('Введи пароль VK')
            }
          }else{
            con.query("UPDATE vk SET password = '"+message+"' WHERE chat_id = "+chat_id, function(err, result){
              if(err) throw err;
              ctx.reply('Ваш пароль: '+message+' ?', Markup
                .keyboard(['Да','Нет'])
                .oneTime()
                .resize()
                .extra()
              )
            })
          }
					break;
				case 'message_sender':
          // 90327755
          message = message.replace(' ', '%20')
          console.log(message);
          vk.setToken({token: result[0].token})
          vk.request('messages.send',{
            'user_id': '90327755',
            'message': message,
            'v': 5.37
          })
          vk.on('done:messages.send', function(res){
            console.log(res);
            ctx.reply('Сообщение отправлено')
          })
					break;
				default:
			}
		}
	})
})

function updateStatus(status){
  con.query("UPDATE vk SET status = '"+status+"' WHERE chat_id = "+global.chat_id)
}


bot.startPolling()
