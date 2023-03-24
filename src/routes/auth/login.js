const axios = require("axios");

module.exports = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.redirect("/auth/login");
  }

  try {
    const mutation = `
            mutation login($email: String!, $password: String!) {
                login(email: $email, password: $password)
            }
        `;

    const { data } = await axios.post(
      "http://localhost:3000/graphql",
      {
        query: mutation,
        variables: {
          email: req.body.email,
          password: req.body.password,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const login = data.data.login;
    console.log(login);
    if (!login) {
      throw new Error("Login invalid.");
    }

    res.cookie('JWT', login, {
        httpOnly: true
    })

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/auth/login");
  }
};
