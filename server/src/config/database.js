import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

export const database = mysql.createPool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DATABASE,
	connectionLimit: 10,
})

await database.promise().execute(`
	CREATE TABLE IF NOT EXISTS messages (
		id INT NOT NULL AUTO_INCREMENT,
		username VARCHAR(255) NOT NULL,
		content VARCHAR(255) NOT NULL,
		PRIMARY KEY (id)
	)
`)
