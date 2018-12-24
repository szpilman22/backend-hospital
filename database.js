
const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

};

mongoose.connect('mongodb://localhost:27017/hospitaldb', options)
    .then(db => console.log('DB is Connected'))
    .catch(err => console.log(err));

module.exports = mongoose;