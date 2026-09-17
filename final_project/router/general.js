const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if (isValid(username)) {
        return res.status(409).json({message: "Username already exists"});
    }

    users.push({ username: username, password: password });

    return res.status(200).json({message: "Registration successful"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 2));
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.entries(books)
        .filter(([key, book]) => book.author.toLowerCase() === author.toLowerCase())
        .map(([key, book]) => ({ ISBN: key, ...book }));

    if (booksByAuthor.length > 0) {
        return res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.entries(books)
        .filter(([key, book]) => book.title.toLowerCase().includes(title.toLowerCase()))
        .map(([key, book]) => ({ ISBN: key, ...book }));

    if (booksByTitle.length > 0) {
        return res.status(200).send(JSON.stringify(booksByTitle, null, 2));
    } else {
        return res.status(404).json({message: "No books found with this title"});
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 2));
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

module.exports.general = public_users;
