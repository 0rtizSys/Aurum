import express from "express";
import path from "path";
const app = express();
app.use(express.json()) // middleware que transforma los req.body a json
const root = process.cwd();

const PORT = 3000;

app.use(express.static(path.join(root, "src/dashboard/public/pages")))

app.listen(PORT,()=>{
    console.log(`Server running on port: ${PORT}`)
})