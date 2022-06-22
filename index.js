const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.6

canvas.width = 1024
canvas.height = 576

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
	}
	
		//detect for collison enemy 
	if(rectCollision({
		rectangle1: enemy,
		rectangle2: player
	}) && enemy.isAttacking){
		console.log("enemy hit")
	}
}

animate()

window.addEventListener('keydown', (event)=> {
	//console.log(event.key)
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
			player.velocity.y -= 20
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
			enemy.velocity.y -= 20
		}
		break
		
		case '0':
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