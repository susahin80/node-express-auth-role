const mongoose = require("mongoose");

const dbUrl = process.env.MONGO_URL;

module.exports = function() {
  mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to ${dbUrl}...`))
    .catch(err => console.log(`Could not Connected to ${dbUrl}...`));
};
