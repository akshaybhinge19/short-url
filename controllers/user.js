const User = require("../models/user");
// const {v4: uuidv4} = require("uuid");
const { setUser} = require("../service/auth")

async function handleCreateUser(req,res) {
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password
    })
    return res.redirect("/");
} 
async function handleUserLogin(req,res) {
    const {email, password} = req.body;
    const user = await User.findOne({email,password});
    if(!user) return res.render("login",{
        error: "Invalid username or password"
    })
    // const sessionId = uuidv4();
    const token = setUser(user);
    res.cookie("uid", token);
    return res.redirect("/");
} 

module.exports = {
    handleCreateUser,
    handleUserLogin
}