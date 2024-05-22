const express = require('express');
const mysql = require("mysql2/promise");
const app = express();
app.set('view engine', 'ejs');

app.use(express.static("public"));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()) // ส่งด้วย Data JSON

const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root', // <== ระบุให้ถูกต้อง
    password: '',  // <== ระบุให้ถูกต้อง
    database: 'student_database',
    port: 3306  // <== ใส่ port ให้ถูกต้อง (default 3306, MAMP ใช้ 8889)
});
// Mock database query
const getUsers = () => {
    return [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ];
};
app.get('/', async (req, res) => {
    // Replace this with your database query
    const connection = await dbConn
    const users = await connection.query('SELECT * from productdata where status = 0')
    console.log(users)
    res.render('index', { users: users[0] });
});

app.post("/productdata", async (req, res) => {
    // ส่งข้อมูลผ่าน body-parser (Middleware)
    const Pname = req.body.Pname;
    if (Pname === "") {
        res.send("ไม่สามารถเพิ่มข้อมูลได้ กรุณากรอกข้อมูล ค่ะ");
    }
    else {
        const connection = await dbConn
        const rows = await connection.query("insert into productdata (Product_name,status) values('" + Pname + "','0')")
        const users = await connection.query("SELECT * from productdata where status = 0")
        //console.log(users)
        res.render('index', { users: users[0] });
        //res.send("เพิ่มข้อมูล " + Pname + " สำเร็จค่ะ");

        //res.render('index', { productName: "เพิ่มข้อมูล " + Pname + " สำเร็จค่ะ" });

    }

})



app.get('/productdata/:id', async (req, res) => {
    console.log("id:" + req.params.id);
    const connection = await dbConn
    const updates = await connection.query("update productdata set status = 2 where Product_id = '" + req.params.id + "'")
    const users = await connection.query("SELECT * from productdata where status = 0")
    //res.render('index', { users: users[0] });
    res.send("<div style='text-align: center;  width: 90%; margin: 5%; border: 5 solid #FF9F66; border-radius: 10px; background-color: #FFFAE6;'><h1 style = 'color:#002379;'>ลบข้อมูลสำเร็จค่ะ</h1><br/><a href='/'>กลับสู่หน้าหลัก</a></div>");
});



app.listen(3000, () => console.log('Server running on port 3000'));