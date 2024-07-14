const URL = require("../models/url")
const shortid = require('shortid');
async function handleGenerateNewShortUrl(req,res) {
    const body = req.body; 
    if(!body.url) return res.status(400).json("URL is required!");
    const shortId = shortid.generate();
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    })
    return res.render("home",{
        id: shortId
    })
    // return res.status(200).json({ id:shortId })
}

async function handleGetAnalytics(req,res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    console.log("res", result, shortId)
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory })
}


module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
}