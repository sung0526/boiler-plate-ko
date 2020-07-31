const {User} = require("../models/User");


//인증 처리를 하는곳
let auth = (req, res, next) => {
    //클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth

    //토큰을 복호화 한 후 유저 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next(); // next하는 이유는 auth.js가 미들웨어여서 다음 단계로 갈수있게 해줌 next없으면 여기에 갇힘.
    })
    //유저가 있으면 인증 okay

    //유저가 없으면 인증 no

}

module.exports = { auth };