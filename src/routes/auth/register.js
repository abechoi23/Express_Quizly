const axios = require("axios");

module.exports = async (req, res) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.username ||
    req.body.password !== req.body.confirmPassword
  ) {
    return res.redirect("/auth/register");
  }

  try {
    const mutation = `
            mutation register($email: String!, $password: String!, $username: String!) {
                register(email: $email, password: $password, username: $username)
            }
        `;

    const{ data } = await axios.post(
      "http://localhost:3000/graphql",
      {
        query: mutation,
        variables: {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      })


    const register = data.data.register;
    console.log(register);
    if (!register) {
      throw new Error("Register invalid.");
    }

    res.cookie('JWT', register, {
        httpOnly: true
    })

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/auth/register");
  }
};
