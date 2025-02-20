const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require('method-override');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

main().then((res) => {
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');


}



app.get("/", (req, res) => {
    res.send("request send home rout");
})



app.get("/chats", async (req, res) => {

    let chats = await Chat.find();
    res.render("index.ejs", { chats });

})

app.get("/chats/new", (req, res) => {
    res.render("new.ejs");

})
app.post("/chats", (req, res) => {
    let { from, to, msg } = req.body;
    let newchat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()


    })
    newchat.save().then((res) => {
        console.log("save successfully")
    }).catch((err) => {
        console.log(err);
    })
    res.redirect("/chats");

})

//edit route
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });

})

app.patch("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updateChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
    console.log(updateChat);
    res.redirect("/chats");


})

app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let deletechat = await Chat.findByIdAndDelete(id);
    console.log(deletechat);
    res.redirect("/chats");

})





app.listen(port, () => {
    console.log(`app listen port number: ${port}`);
})