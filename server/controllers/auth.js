import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Register User

export const register = async (req, res) => {
  try {
    //req.bodyden gelen veriler parçalandı
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    //Bycrytten salt üretildi ve şifre hashlenir
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //kullanıcının kayıt edilecek bilgileri alındı
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    //veritabanına kayıt yapıldı ve bilgiler response edildi
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login In

export const login = async (req, res) => {
  try {
    //req.bodyden gelen veriler parçalanır
    const { email, password } = req.body;
    //veriler ile veritabanında arama yapılır
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });
    //kullanıcı varsa şifre rehash yapılarak kontrolü sağlanır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    //kullanıcı için bit token olusturuldu
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    //response verisinden şifre çıkarıldı
    delete user.password;

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};
