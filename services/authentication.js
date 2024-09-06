import dotenv from 'dotenv'
dotenv.config()
import JWT from 'jsonwebtoken'

const secret = process.env.SECRET

function generateTokenForUser(user){
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl
    }

    const token = JWT.sign(payload, secret)

    return token

}


function validateToken(token){
    const payload = JWT.verify(token, secret)

    return payload
}

export {
    generateTokenForUser,
    validateToken
}
