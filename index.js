import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import connectMongoDB from './connection.js'
import checkForAuthentication from './middlewares/authentication.js'
import userRoute from './routes/user.js'

const app = express()

connectMongoDB('mongodb://localhost:27017/auction')
.then(() => console.log('MongoDB Connected'))

// app.use('view engine', 'ejs')
// app.use('views', path.resolve('./views'))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
// app.use(checkForAuthentication('token'))

app.use('/user/checkAuth', checkForAuthentication('token'))

app.use('/api/user', userRoute)

app.get('/', (req, res) => {
    res.send('Server running')
})


app.listen(8000, () => console.log(`Server Started at 8000`))
