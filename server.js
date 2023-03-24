const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./src/db");
const { User, Question, Quiz, Submission } = require("./src/models");
const setupRoutes = require("./src/routes");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./src/graphql/schema");
const cookieParser = require("cookie-parser");
const { authenticate } = require("./src/middleware/authenticate");
const { userData } = require("./src/middleware/userData");

dotenv.config();
connectDB();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/templates/views");

app.use(cookieParser());
app.use(authenticate);
app.use(userData);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use(express.urlencoded({ extended: true }));

// require=('./src/routes')(app)
setupRoutes(app);

app.get("/", async (req, res) => {
  /*   const user = await User.findById('641a04d5d8430f29466bf9e1')
    const user = await User.find({ username: 'Dsmith'})
    const user = await User.findOne({ username: 'Dsmith'})
  console.log(user)

    const newUser = new User({ 
        username: 'noodle', 
        email: 'noodle@codingtemple.com',
        password: 'foodfornoodle'
    })
    await newUser.save() */

  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Quizly running on port ${process.env.PORT}`);
});
