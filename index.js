var express = require('express')
var app= express()

app.get('/',(req, res)=>{
	// Для удобства переменная будет tool
	var choose = req.query.tool
	var tools = ['stone', 'paper','scissors']
	// Проверяю отправляет ли пользователь мне предмет, если нет, то прошу отправить
	if(choose	== undefined){
		res.send('Choose tool: paper/scissors/stone')
	}else{
		// Пользователь что-то выбрал. Теперь проверяем есть ли такой предмет в игре. Если нет,
		// говорим, какие предметы есть. Иначе все ок
		// КОСТЫЛЬ!!!!
		var x = 0
		for (var i = 0; i < tools.length; i++) {
			if(choose == tools[i]){
				x = 1
			}
		}
		if(x == 0){
			res.send('Нет такого предмета. Предметы: paper/scissors/stone')
		}else{
			// Компьютер выбирает рандомный предмет из массива тулз
			var choose_c = tools[Math.floor(Math.random() * (tools.length))]
			// Идет сравнение :)
			if (choose==choose_c) {
			 answer='сыграл в ничью'
			}
			// Выигрываем
			if (choose=='paper' && choose_c =='stone') {
			 answer='выиграл'
			}
			if (choose=='stone' && choose_c =='scissors') {
			 answer='выиграл'
			}
			if (choose=='scissors' && choose_c =='paper') {
			 answer='выиграл'
			}
			// Проигрываем
			if (choose=='stone' && choose_c =='paper') {
			 answer='проиграл'
			}
			if (choose=='scissors' && choose_c =='stone') {
			 answer='проиграл'
			}
			if (choose=='paper' && choose_c =='scissors') {
			 answer='проиграл'
			}
			res.send('Ты выбрал '+choose+' и <b>'+answer+'</b>. Компьютер выбрал '+choose_c)
		}
	}
})

// Это убираем, потому что не надо :)
/*
variable.get('/',(req, res)=>{
 res.send(answer)
})
*/

app.listen(1337, function(){
	console.log('Server working');
})
