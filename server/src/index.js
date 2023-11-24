import { database } from './config/database.js'
import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'http'

const app = express()
const server = createServer(app)
const io = new Server(server)

dotenv.config({ path: './.env' })

app.use(logger('dev'))

io.on('connection', async socket => {
	console.log('a user connected')

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})

	socket.on('chat message', async msg => {
		console.log('message: ' + msg)

		let result
		const username = socket.handshake.auth.username ?? 'Anonymous'

		try {
			result = database
				.promise()
				.execute('INSERT INTO messages (username, content) VALUES (?, ?)', [
					username,
					msg,
				])
		} catch (e) {
			console.error(e)
		}

		io.emit('chat message', msg, result.lastInsertRowId, username)
	})

	if (!socket.recovered) {
		socket.recovered = true

		let result

		try {
			result = await database
				.promise()
				.execute('SELECT * FROM messages ORDER BY id DESC LIMIT 10')
		} catch (e) {
			console.error(e)
		}

		result[0].forEach(row => {
			socket.emit('chat message', row.content, row.id, row.username)
		})
	}
})

app.get('/', (req, res) => {
	res.sendFile(path.join(path.resolve(), '../client/index.html'))
})

server.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}.`)
})
