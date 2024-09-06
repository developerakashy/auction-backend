import { Router } from "express";
import User from "../models/user.js";

const router = Router()

// router.get('/', (req, res) => {
//     return res.json({status: 'successfull'})
// })

router.get('/logout', (req, res) => {
    return res.clearCookie('token').json({status: 'sucessfull'})
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body


    try{
        const token = await User.matchPasswordAndGenerateToken(email, password)
        return res.cookie('token', token).json({status: 'successfull'})

    }catch(e){
        console.log('Login Error: ', e.message)
        return res.json({status: 'unsuccessfull', error: e.message})

    }

})


router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body

    try{
        const user = await User.create({
            fullName,
            email,
            password
        })

        const token = await User.matchPasswordAndGenerateToken(email, password)

        return res.cookie('token', token).json({status: 'successfull', userId: user._id})


    }catch(error){
        console.log("Error: ", error)

        return res.json({status: 'unsuccessfull', error: 'email already exist'})

    }


})

export default router
