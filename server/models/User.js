const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String, 
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String, 
        maxlength: 100
    },
    lastname: {
        type: String, 
        maxlength: 50
    },
    role: {
        type: Number, 
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


userSchema.pre('save', function( next ){

    var user = this;
    //패스워드가 바뀔때만 비밀번호를 암호화 시킨다.
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            
            bcrypt.hash(user.password, salt, function(err, hash) { //hash => 암호화 된 비밀번호
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    }else {
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234 암호화 된 비밀번호 this.password (="$2b$10$n1o9nSGiMK1qW/ZsUrx9AuTkSJ8KTIPZ6VKYGKxMM1/2nFLoQrFFu")
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb) {
    var user = this;
    //jsonwebToken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode한다
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 후
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err)return cb(err);
            cb(null, user)
        })
    });
}



const User = mongoose.model('User', userSchema)

module.exports = {User}