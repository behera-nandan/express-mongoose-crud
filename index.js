const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require('method-override');
const ExpressError = require("./ExpressError");



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

// using wrapAsync
function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err))
    };
}



app.get("/", (req, res) => {
    res.send("request send home rout");
})



app.get("/chats", async (req, res) => {

    let chats = await Chat.find();

    res.render("index.ejs", { chats });

});

app.get("/chats/new", asyncWrap((req, res) => {
    res.render("new.ejs");

}));
app.post("/chats", asyncWrap(async (req, res) => {

    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from,
        to,
        msg,
        created_at: new Date()
    });

    await newChat.save();

    console.log("Saved successfully");
    res.redirect("/chats");
}));


//edit route
app.get("/chats/:id/edit", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
        return next(new ExpressError(404, "chat not found"));
    }
    res.render("edit.ejs", { chat });

}));

app.patch("/chats/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    let updateChat = await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
    console.log(updateChat);
    res.redirect("/chats");


}));

app.delete("/chats/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let deletechat = await Chat.findByIdAndDelete(id);
    console.log(deletechat);
    res.redirect("/chats");

}));

const handleValidationErr = (err) => {
    console.log("validation error occured. please follow the rule");

    return err;
}

app.use((err, req, res, next) => {

    if (err.name === "ValidatorError") {
        err = handleValidationErr();
    }
    next(err);
})



app.use((err, req, res, next) => {
    let { status = 500, message = "some error occured" } = err;
    res.status(status).send(message);

})




app.listen(port, () => {
    console.log(`app listen port number: ${port}`);
})