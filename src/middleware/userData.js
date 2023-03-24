const axios = require("axios");

const userData = async (req, res, next) => {
  if (!req.verifiedUser) {
    return next();
  }

  try {
    const query = `
        query user($id: ID!) {
            user(id: $id) {
                id,
                username,
                email,
                quizzes {
                    id,
                    slug,
                    avgScore,
                    title,
                    description,
                    questions{
                        title,
                        order,
                        correctAnswer
                    },
                    submissions {
                        score,
                        userId
                    }
                },
                submissions {
                    id,
                    userId,
                    quizId,
                    quiz{
                        title,
                        description
                    },
                    score
                }
            }
        }
        `;

    const data = await axios.post(
      "http://localhost:3000/graphql",
      {
        query: query,
        variables: {
          id: req.verifiedUser.user._id,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let user = data.data.data.user;

    req.verifiedUser = user;
    next();
  } catch (e) {
    console.log(e);
    next();
  }
};

module.exports = {
  userData,
};
