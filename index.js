import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


let posts = [];
let currentId = 1;
let username="guest";


app.get("/", (req, res) => {
  res.render("login.ejs",{posts});
});

app.get("/home", (req, res) => {
    res.render("index.ejs",{
        posts:posts,
        username:username,
    });
});

app.post("/home", (req, res) => {
    console.log(req.body.username);
    username=req.body.username;
    res.render("index.ejs",{
        posts:posts,
        username:username,
    });
});


app.post("/post", (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newPost = {
        id: currentId++,
        title,
        content
    };
    posts.push(newPost);
    res.render("index.ejs",{
        posts:posts,
        username:username,
    });
});

app.get('/view/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);

    // Find the post that matches the postId
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('view.ejs', { post,
        username:username,
    });
});

app.get('/edit/:id', (req, res) => {
    // console.log("hey");
    const postId = parseInt(req.params.id, 10);
    const post = posts.find(p => p.id === postId);
  
    if (!post) return res.status(404).send('Post not found');
    
    res.render('edit.ejs', { post ,username:username,});
  });
// Update route

app.post("/edit/:id", (req, res) => {
    const { title, content } = req.body;
    const post = posts.find(p => p.id == req.params.id);
    if (post) {
        post.title = title;
        post.content = content;
        res.redirect("/home");
    } else {
        res.status(404).send("Post not found");
    }
});

app.post('/submitcontact', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    res.redirect('/home');
});

app.get('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    posts = posts.filter(post => post.id !== postId);
    res.redirect('/home');
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
  });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});