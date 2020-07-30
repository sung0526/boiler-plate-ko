const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");
const config = require("./config/key");

//application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해주기 위한것  -> client에서 오는 정보를 server에서 분석해서 가져올 수 있게 하는 부분
app.use(bodyParser.urlencoded({extended: true}));
//application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 해주기 위한것
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World!'))



app.post('/register', (req, res) => {
    //회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다

    const user = new User(req.body)
    // 이 때 User.js에서 userSchema.pre('save', function(){ 여기 안에 있는 처리를 한 후 } 밑으로 넘어감
    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))