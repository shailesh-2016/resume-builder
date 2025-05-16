const { default: mongoose } = require("mongoose");

const db = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected......");
    })
    .catch((err) => console.log(err));
};
module.exports=db
