const jwt = require('jsonwebtoken');
const { checkPassword, findUserId, checkUser, createUser } = require('../../models/userModel');

// Return a JWT
exports.login = async (req, res) => {
    var response = {}
    const {username, password} = req.body
    if (!username || !password ){
        res.status(401).send({errors: "No username or password sent"})
        return
    }

    const isUser = await checkUser(username)
    if (!isUser) {
        await createUser(username, password)
        const isUser = await checkUser(username)
        if (isUser) response['message'] = "No existing user found. Account created successfully."
        else {
            res.status(401).send({errors: "No existing user found. Couldn't create a new account."})
            return
        }
    }
    
    const isPassword = await checkPassword(username, password)

    if (isPassword) {
        const userId = await findUserId(username)
        const token = jwt.sign({
            data: {
                username: username,
                userId: userId
            }
            }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        response['token'] = token
        res.json(response)
    }
    else
        {
        res.status(401).send('Invalid credentials.')
    }
}

