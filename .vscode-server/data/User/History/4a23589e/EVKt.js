const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const router = express.Router();
//회원가입 post/users
router.post("/users", async (req, res) => {
    const {nickname, password, confirmPassword} = req.body;
    // 닉네임 및 비밀번호 유효성 검사
    const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!nicknameRegex.test(nickname)) {
        return res.status(400).json({ message: "닉네임은 최소 3자 이상이어야 하며, 알파벳과 숫자만 사용 가능합니다." });
    }
    if (password.length < 4 || password.includes(nickname)) {
        return res.status(400).json({ message: "비밀번호는 최소 4자 이상이어야 하며 닉네임을 포함할 수 없습니다." });
    }
    if (password !== confirmPassword){
        return res.status(400).json({message:"비밀번호가 비밀번호 확인과 일치하지 않습니다."})
    }
    const existingUser = await User.findOne({nickname});
    if (existingUser){
        return res.status(400).json({message:"중복된 닉네임입니다."});
    }
    const hahsedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({nickname, password:hahsedPassword});
    await newUser.save();
    //mongoose 라이브러리 사용 save
    //db.collection("users").insertOne({
    //username:"아이디",
    //password: hashedPassword,
    //});
    res.status(201).json({message:"회원가입 완료!"});
});
// 로그인 api
router.post("/login", async(req, res)=> {
    const { nickname, password } = req.body; //로그인 시 리퀘스트 바디에서 추출
    const user = await User.findOne({nickname});
    if(!user){
        console.log("아이디")
        return res.status(400).json({message:"닉네임 또는 패스워드를 확인해주세요"});
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        console.log("비번")
        return res.status(400).json({message:"닉네임 또는 패스워드를 확인해주세요"});
    }
    //로그인 검증 성공시 JWT
    const token = jwt.sign({userId:user._id} , "magic_number", { expiresIn: "1h" });
    res.cookie("authorization", `Bearer ${token}`);
    res.json({message: "로그인 성공"});
});
module.exports = router;