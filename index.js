const express = require("express")
const app = express()
const fs = require("node:fs/promises")
const path = require("node:path")
let musicArr = require(path.resolve(__dirname+"/data/desc.json"))
const exp = require("node:constants")
console.log(__dirname)
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/dist'))
//解析json的中间件
app.use(express.json())
app.use((req, res, next) => {
    //设置允许的请求路径
    res.setHeader("Access-Control-Allow-Origin", "*")
    //设置允许的请求方式
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH")
    //设置允许的请求头
    res.setHeader("Access-Control-Allow-Headers", "Content-type,authorization")
    next()
})


app.get("/musicList",(req,res)=>{
    res.send({
        status:'ok',
        data:musicArr
    })
})
app.post("/musicList",(req,res)=>{
    const {title,name} = req.body
    const newMusic = {
        id:musicArr.at(-1).id+1,
        title:title,
        name:name
    }

    musicArr.push(newMusic);

    fs.writeFile(
        path.resolve(__dirname, "./data/desc.json"),
        JSON.stringify(musicArr)
    ).then(() => {
        res.redirect("/")
    }).catch((e) => {
        console.log("出错了~", e);
    })
})

app.delete("/musicList",(req,res)=>{
    const id = req.body.id
    musicArr=musicArr.filter((item)=>item.id!=id)
    fs.writeFile(path.resolve(__dirname,"./data/desc.json"),
    JSON.stringify(musicArr))
    .then(()=>{
        res.redirect('/')
    }).catch(e=>{
        console.log('出错了',e);
    })
})


app.listen(8080,()=>{
    console.log("服务器启动");
})