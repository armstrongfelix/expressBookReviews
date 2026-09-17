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

// Task 10: Get the book list available in the shop using Promise
public_users.get('/', async (req, res) => {
    try {
        const getBooks = () => {
            return new Promise((resolve) => {
                resolve(books);
            });
        };
        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 2));
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
});

// Task 11: Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const getBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                const book = books[isbn];
                if (book) {
                    resolve(book);
                } else {
                    reject("Book not found");
                }
            });
        };
        const book = await getBookByISBN(isbn);
        return res.status(200).send(JSON.stringify(book, null, 2));
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                const booksByAuthor = Object.entries(books)
                    .filter(([key, book]) => book.author.toLowerCase() === author.toLowerCase())
                    .map(([key, book]) => ({ ISBN: key, ...book }));
                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject("No books found by this author");
                }
            });
        };
        const result = await getBooksByAuthor(author);
        return res.status(200).send(JSON.stringify(result, null, 2));
    } catch (error) {
        return res.status(404).json({message: error});
    }
});

// Task 13: Get all books based on title using async-await
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                const booksByTitle = Object.entries(books)
                    .filter(([key, book]) => book.title.toLowerCase().includes(title.toLowerCase()))
                    .map(([key, book]) => ({ ISBN: key, ...book }));
                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject("No books found with this title");
                }
            });
        };
        const result = await getBooksByTitle(title);
        return res.status(200).send(JSON.stringify(result, null, 2));
    } catch (error) {
        return res.status(404).json({message: error});
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
