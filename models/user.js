import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from 'crypto'
import { generateTokenForUser } from '../services/authentication.js'

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true})


userSchema.pre('save', function (next){
    const user = this

    if(!user.isModified('password')) return

    const salt = randomBytes(16).toString()

    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex')

    this.salt = salt
    this.password = hashedPassword

    next()
})


userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({ email })

    if(!user) throw new Error('email does not exist')


    const salt = user.salt
    const hashedPassword = user.password

    const userProvidedPasswordHashed = createHmac('sha256', salt).update(password).digest('hex')

    if(!(hashedPassword === userProvidedPasswordHashed)) throw new Error('incorrect password')

    const token = generateTokenForUser(user)

    return token
})


const User = model('user', userSchema)

export default User
