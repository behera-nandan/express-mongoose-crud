const mongoose = require("mongoose");
const Chat = require("./models/chat.js")

main().then((res) => {
    console.log("connection successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');


}



const chatData = [
    {
        from: "Alice",
        to: "Bob",
        msg: "Hello, how are you?",
        created_at: new Date()
    },
    {
        from: "Bob",
        to: "Alice",
        msg: "I'm good! How about you?",
        created_at: new Date()
    },
    {
        from: "Charlie",
        to: "Alice",
        msg: "Hey, are you coming to the meeting?",
        created_at: new Date()
    },
    {
        from: "Alice",
        to: "Charlie",
        msg: "Yes, I’ll be there in 10 mins.",
        created_at: new Date()
    },
    {
        from: "David",
        to: "Eve",
        msg: "Did you finish the report?",
        created_at: new Date()
    },
    {
        from: "Eve",
        to: "David",
        msg: "Almost done, just adding final touches.",
        created_at: new Date()
    },
    {
        from: "Frank",
        to: "Grace",
        msg: "Let’s catch up later!",
        created_at: new Date()
    }
];


Chat.insertMany(chatData).then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err);
})








