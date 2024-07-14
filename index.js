const express = require("express");
const app = express();
const path = require("path");
const { connectMongoDB } = require("./connection")
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly, checkAuth } = require("./middlewares/auth")

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/statisRoutes");
const userRoute = require("./routes/user");


const PORT = 8001;
const URL = require("./models/url");

// connection
connectMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(()=>console.log('MongoDb connected!'))
.catch((err)=>console.log("error connected to db",err))


app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"))

//middlewares
// app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());

//routes
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user",userRoute);


// app.get("/test",async (req,res)=>{
//     const allUrls = await URL.find({});
//     return res.render("home",{
//         urls: allUrls
//     })
//     // return res.end(`
//     //     <html>
//     //     <head></head>
//     //         <body>
//     //             <ol>
//     //                 ${allUrls.map((url)=>`<li>
//     //                         ${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}
//     //                         </li>`).join('')}
//     //             </ol>
//     //         </body>
//     //     </html>
//     //     `)
// })

app.get("/url/:shortId", async (req,res)=> {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },
    {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            },
        }
    }
    )
    // const urlData = await URL.findById(req.params.shortId);
    res.redirect(entry?.redirectURL);
})

app.listen(PORT,()=>console.log(`Server Started at PORT: ${PORT}`))
