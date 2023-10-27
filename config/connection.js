const mongoose = require("mongoose");

module.exports = {
    connectDb: async function () {
        try {
            mongoose.connect(process.env.db_url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: "files"
            })
            const db = mongoose.connection
            db.on("error",()=>console.log("Mongodb connection failed"));
            db.once("open", () => {
                console.log("Connected mongodb");
            })

        } catch (e) {
            console.log(e);
        }
    }
}
