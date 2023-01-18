import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import {register} from ".controllers/auth.js"

//dot.env için gerekli()
dotenv.config();

//Configurations

//Yüklenecek Dosya adını ve yolu için gerekli middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.urlencoded({limit:"30mb",extended: true})); 
app.use(express.json({limit:"30mb",extended: true}));
app.use(cors());
app.use("/assets,", express.static(path.join(__dirname, "public/assets")));

//File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//Routes with Files
app.post("/auth/register,",upload.single("picture"),register)




//MONGOOSE Setup
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },mongoose.set('strictQuery', true))
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port:${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
  
  