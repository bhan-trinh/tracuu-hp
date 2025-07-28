const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    hashPassWord: async (password) => {
        return await bcrypt.hash(password, saltRounds);
    },
    checkPassword: async (password, hash) => {
        return await bcrypt.compare(password, hash);
    } 
}