import  jwt  from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    //Token headerdan değişkene atanır
    let token = req.header("Authorization");
    //Kontrol edilir
    if (!token) {
      res.status(403).send("Access Denied");
    }
    //Gelen token Bearer: ile başlamakta temizlemek için aşağıdaki işlem uygulanır
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, tokens.length).trimLeft();
    }
    //jwt ile token kontrolü yapılır,usera verified verilir ve diğer işleme geçilir,
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
    
  } catch (err) {
    res.status(500).json({ error: err.msg });
  }
};
