const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.6


canvas.width = 1280
canvas.height = 720

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite{
	constructor({position, velocity, color="red", offset}){
		this.position = position
		this.velocity = velocity
		this.height = 150
		this.width = 50
		this.lastKey
		this.attackBox ={
			position:{
				x: this.position.x ,
				y: this.position.y
			},
			offset,
			width: 100,
			height: 50
		},
		this.color = color
		this.isAttacking
		this.health = 100
		this.winns = 0
	}
	
	draw(){
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
		
		if(this.isAttacking){
		//attack box 
		c.fillStyle = "green"
		c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
		}
	}
	
	update(){
		this.draw()
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y
		
		if(this.position.y + this.height + this.velocity.y >= canvas.height){
		
			this.velocity.y = 0
		}else{
			this.velocity.y += gravity
		}
		
		
		
		this.position.y += this.velocity.y
		this.position.x += this.velocity.x
		
	}
	
	attack(){
		this.isAttacking = true
		setTimeout( () => {
			this.isAttacking = false
		}, 100)
	}
}

const player = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	velocity:{
		x: 0,
		y: 0
	},
	offset:{
		x: 0,
		y: 0
	}
})

const enemy = new Sprite({
	position: {
		x: 150,
		y: 150
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: 'blue',
	offset:{
		x: -50,
		y: 0
	}
	
	
})

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed:false
	},
	w: {
		pressed:false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed:false
	},
	ArrowUp: {
		pressed:false
	}
}

function rectCollision({rectangle1, rectangle2}){

	return  rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&  
			rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
			rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&  
			rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height 
}

let time = 60
let timerID
let is_score_updated = false
document.querySelector("#pwin").innerHTML = player.winns
document.querySelector("#ewin").innerHTML = enemy.winns

function determin_winner({player, enemy, timerID}){
	clearTimeout(timerID)
	if(player.health === enemy.health){
		document.querySelector("#result").innerHTML = "Unentschieden" 
		game_ended = true
	}
	
	if(player.health > enemy.health){			
		document.querySelector("#result").innerHTML = "Spieler hat gewonnen" 
		document.querySelector("#pwin").innerHTML = player.winns
		if(!is_score_updated){
			is_score_updated = true
			player.winns++
		}
	}
		
	if(player.health < enemy.health){			
		document.querySelector("#result").innerHTML = "Enemy hat gewonnwn" 
		document.querySelector("#ewin").innerHTML = enemy.winns	
		if(!is_score_updated){
			is_score_updated = true
			enemy.winns++
		}
	}
}
function dec_timer(){
	
	if(time> 0) {
		timerID = setTimeout(dec_timer, 1000)
		document.querySelector("#timer").innerHTML = --time
	}else if(time === 0){
		determin_winner({player, enemy, timerID})
	}
}

dec_timer()


function animate(){
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()
	
	player.velocity.x = 0
	enemy.velocity.x = 0
	
	if( keys.a.pressed && player.lastKey ==='a'){
		player.velocity.x = -5
	}else if (keys.d.pressed && player.lastKey ==='d'){
		player.velocity.x = 5
	}
	
	
	if( keys.ArrowLeft.pressed && enemy.lastKey ==='ArrowLeft'){
		enemy.velocity.x = -5
	}else if (keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight'){
		enemy.velocity.x = 5
	}
	
	//detect for collison player 
	
	
	if(rectCollision({
		rectangle1: player,
		rectangle2: enemy
	}) && player.isAttacking){
		console.log("player hit")
		if(enemy.health > 10){
			enemy.health -= Math.floor((Math.random()*5)+1)
		}else{
			enemy.health = 0
		}
		document.querySelector('#enemy').style.width = enemy.health + '%'
	}
	
		//detect for collison enemy 
	if(rectCollision({
		rectangle1: enemy,
		rectangle2: player
	}) && enemy.isAttacking ){
		console.log(enemy.cooldown)
		console.log("enemy hit")
		if(player.health > 10){
			player.health -= Math.floor((Math.random()*5)+1)
		}else{
			player.health = 0
		}
		document.querySelector('#player').style.width = player.health + '%'
	}
	
	
	//game end based on health
	if(enemy.health <= 0 || player.health <=0){
		determin_winner({player, enemy, timerID})
	}
}

animate()

window.addEventListener('keydown', (event)=> {
	switch(event.key){
		case 'd':
		keys.d.pressed = true
		player.lastKey='d'
		break
		
		case 'a':
		keys.a.pressed = true
		player.lastKey = 'a'
		break
		
		case 'w':
		if(player.velocity.y == 0){
			player.velocity.y -= 15
		}
		break
		
		case ' ':
			player.attack()
			break
		
		case 'ArrowRight':
		keys.ArrowRight.pressed = true
		enemy.lastKey = 'ArrowRight'
		break
		
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = true
		enemy.lastKey = 'ArrowLeft'
		break
		
		case 'ArrowUp':
		if(enemy.velocity.y == 0){
			enemy.velocity.y -= 15
		}
		break
		
		case 'ArrowDown':
		enemy.attack()
		break
	}
})

window.addEventListener('keyup', (event)=> {
	switch(event.key){
		case 'd':
		keys.d.pressed = false
		break
		
		case 'a':
		keys.a.pressed = false
		break
		
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
		break
		
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
		break
		
		
	}
})