import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'

const app = express()

dotenv.config({ path: './.env' })

app.use(logger('dev'))

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}.`)
})
