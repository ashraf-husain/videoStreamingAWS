const mongoose = require('mongoose')

module.exports = () => {
    const mongodb_url = process.env.MONGO_URI
    const conn = mongoose.connect(mongodb_url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    mongoose.connection.on('open', () => {
        console.log(`Database conected to ${mongodb_url}`)
    })
    mongoose.connection.on("error", (err) => {
        console.log(`Database conection error ${err.message}`, err)
    })
}