const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const users = require('./data').userDB;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/restration.html'));
});


app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>등록 성공</h2></div><br><br><div align='center'><a href='./login.html'>로그인</a></div><br><br><div align='center'><a href='./registration.html'>다른 사용자 등록</a></div>");
        } else {
            res.send("<div align ='center'><h2>이미 사용된 이메일 주소</h2></div><br><br><div align='center'><a href='./registration.html'>다시 등록</a></div>");
        }
    } catch{
        res.send("인터넷 서버 오류");
    }
});

app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>로그인 성공</h2></div><br><br><br><div align ='center'>
                            <h3>안녕하세요. ${usrname}님</h3>\n
                            <a href = https://discord.gg/WBk5tufQx8>DISCORD 서버로 이동</a></div><br><br>
                            <div align='center'><a href='./login.html'>로그아웃</a></div>`);
            } else {
                res.send("<div align ='center'><h2>잘못된 이메일 또는 비밀번호</h2></div><br><br><div align ='center'><a href='./login.html'>다시 로그인</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>잘못된 이메일 또는 비밀번호</h2></div><br><br><div align='center'><a href='./login.html'>다시 로그인<a><div>");
        }
    } catch{
        res.send("인터넷 서버 오류");
    }
});


server.listen(3000, function(){
    console.log("서버가 포트에서 수신 대기 중입니다: 3000");
});