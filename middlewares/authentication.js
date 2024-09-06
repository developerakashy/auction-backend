import { validateToken } from '../services/authentication.js'

function checkForAuthentication(cookieName){
    return (req, res, next) => {
        const cookieToken = req.cookies[cookieName]

        if(!cookieToken){

            return res.json({status: 'unsucessfull', error: 'autentication unsuccessfull'})
        }

        try{
            const user = validateToken(cookieToken)
            req.user = user
            return res.json({status: 'successfull', user: user})
        }catch(error){

        }

        next()
    }

}

export default checkForAuthentication
