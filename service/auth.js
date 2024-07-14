// const sessionIdToUserMap = new Map();
const jwt = require("jsonwebtoken");
const secret = "$Akshay@123@$"

function setUser(user) {
    // sessionIdToUserMap.set(id,user);
    return jwt.sign({
        _id: user._id,
        email: user.email
    },secret)
}

function getUser(token) {
    if(!token) return null;
    // return sessionIdToUserMap.get(id);
    return jwt.verify(token, secret);
}

module.exports = {
    setUser,
    getUser
}