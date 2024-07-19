const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const secretKey = "11s1cdcDSSS4sacAV5AVASC4"

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 6000000 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(404).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization['username'];
  console.log(isbn)
  console.log(review)
  console.log(username)

  if (books[isbn].reviews.hasOwnProperty(username)) {
    books[isbn].reviews[username].review = review;
    console.log(1);
    res.send(books[isbn].reviews);
  } else {
    books[isbn].reviews[username] = { username, review };
    console.log(2);
    res.send(books[isbn]);
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let username = req.session.authorization['username'];
    if (books[isbn].reviews) {
        books[isbn].reviews = Object.fromEntries(Object.entries(books[isbn].reviews).filter(([key, value]) => key !== username));

        res.send(books[isbn].reviews);
    } else {
        res.send('No reviews found for this ISBN.');
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
