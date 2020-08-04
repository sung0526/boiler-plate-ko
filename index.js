const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const { User } = require("./server/models/User");
const config = require("./server/config/key");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { auth } = require('./server/middleware/auth');

//application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해주기 위한것  -> client에서 오는 정보를 server에서 분석해서 가져올 수 있게 하는 부분
app.use(bodyParser.urlencoded({extended: true}));

//application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 해주기 위한것
app.use(bodyParser.json());
app.use(cookieParser());


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})
.then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err))



app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api/hello', (req, res) => res.send('안녕하세요 !'))



app.post('/api/users/register', (req, res) => {
    //회원 가입 할때 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다
    const user = new User(req.body)
    
    // 이 때 User.js에서 userSchema.pre('save', function(){ 여기 안에 있는 처리를 한 후 } 밑으로 넘어감
    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        });
    });
});

app.post('/api/users/login', (req, res) => {
    //요청된 이메일이 데이터베이스에 있는지 찾는다.
    User.findOne({ email: req.body.email}, (err, user)=> {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
        //요청된 이메일이 데이터베이스에 있다 비밀번호가 같은지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            
            //비밀번호까지 맞다면 토큰을 생성한다.
            user.generateToken((err, user)=> {
                if(err) return res.status(400).send(err);
                
                //token을 저장한다. 어디에? 쿠키, 로컬스토리지, 이번엔 쿠키에 할것
                res
                .cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id});
            });
        });
    });
});

//role 1 어드만  role 2 특정 부서 어드민
//role 0 일반유저 0아니면 관리자
app.get('/api/user/auth', auth, (req,res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True 라는 말. 
    res.status(200).json({
        _id: req.user._id,
        idAdmin: req.user.role === 0? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({success: true})
    })
    
})



const port = 5000

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))