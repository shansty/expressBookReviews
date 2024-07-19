const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  let {username, password} = req.body;
  if(!username || !password) {
    res.send("User name or password is empty")
  } 
  let user = users.find(el => el.us == username)
  if(user) {
    res.send("User already exist")
  } else {
    let newUser = {
      "username" : username,
      "password" : password
    }
    users.push(newUser);
    res.send("Register was successful")
  }

  return res.status(300).json({message: "Yet to be implemented"});
});


public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(books);
      }, 1000);
  }).then((data) => {
      return res.send(JSON.stringify(data, null, 1));
  }).catch((error) => {
      console.error(error);
      return res.status(500).send('Error fetching books data.');
  });
});


public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(books[isbn]);
    }, 1000);
}).then((data) => {
    return res.send(JSON.stringify(data, null, 1));
}).catch((error) => {
    console.error(error);
    return res.status(500).send('Error fetching books data.');
});
 });
  

public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  new Promise((resolve, reject) => {
    setTimeout(() => {
      let booksArray = Object.values(books)
      resolve(booksArray.filter(book => book.author === author));
    }, 1000);
    }).then((data) => {
        return res.send(JSON.stringify(data, null, 1));
    }).catch((error) => {
        console.error(error);
        return res.status(500).send('Error fetching books data.');
    });
});


public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  new Promise((resolve, reject) => {
    setTimeout(() => {
      let booksArray = Object.values(books)
      resolve(booksArray.filter(book => book.title === title));
    }, 1000);
    }).then((data) => {
        return res.send(JSON.stringify(data, null, 1));
    }).catch((error) => {
        console.error(error);
        return res.status(500).send('Error fetching books data.');
    });
});


public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(isbn) {
    res.send(books[isbn].reviews)    
  } else {
  return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
