// app.js (Frontend)

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();

    document.getElementById('add-book-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const bookData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            genre: document.getElementById('genre').value,
            publication_date: document.getElementById('publication_date').value,
            isbn: document.getElementById('isbn').value
        };

        try {
            const response = await fetch('/add-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });
            const result = await response.text();
            alert(result);
            fetchBooks();
        } catch (err) {
            console.error(err);
            alert('Failed to add book.');
        }
    });

    document.getElementById('filter-books').addEventListener('click', async function () {
        const filters = {
            title: document.getElementById('search-title').value,
            author: document.getElementById('search-author').value,
            genre: document.getElementById('search-genre').value,
            publication_date: document.getElementById('search-publication_date').value
        };

        try {
            const response = await fetch('/filter-books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filters)
            });
            const books = await response.json();
            displayBooks(books);
        } catch (err) {
            console.error(err);
            alert('Failed to filter books.');
        }
    });

    document.getElementById('export-csv').addEventListener('click', async function () {
        window.location.href = '/export-books/csv';
    });

    document.getElementById('export-json').addEventListener('click', async function () {
        window.location.href = '/export-books/json';
    });
});

async function fetchBooks() {
    try {
        const response = await fetch('/get-books');
        const books = await response.json();
        displayBooks(books);
    } catch (err) {
        console.error(err);
        alert('Failed to fetch books.');
    }
}

function displayBooks(books) {
    const tableBody = document.querySelector('#books-list tbody');
    tableBody.innerHTML = '';
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.entry_id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.publication_date}</td>
            <td>${book.isbn}</td>
        `;
        tableBody.appendChild(row);
    });
}
