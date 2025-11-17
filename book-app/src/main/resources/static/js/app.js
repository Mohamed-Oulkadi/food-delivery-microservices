// URL de l'endpoint GraphQL
const GRAPHQL_URL = '/graphql';

/**
 * Fonction générique pour exécuter les requêtes GraphQL.
 * @param {string} query - La requête ou mutation GraphQL.
 * @param {object} variables - Les variables pour la requête.
 * @returns {Promise<object|null>} Les données de la réponse ou null en cas d'erreur.
 */
async function executeGraphQL(query, variables = {}) {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const result = await response.json();

        if (result.errors) {
            console.error('Erreur GraphQL:', result.errors);
            alert('Erreur: ' + result.errors[0].message);
            return null;
        }

        return result.data;

    } catch (error) {
        console.error('Erreur réseau ou fetch:', error);
        alert('Erreur de connexion au serveur. Vérifiez la console.');
        return null;
    }
}

// --- Événements au chargement de la page ---

document.addEventListener('DOMContentLoaded', function () {
    // Charge tous les livres au démarrage
    loadAllBooks();

    // Attache l'événement au formulaire d'ajout
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Empêche le rechargement de la page
            addNewBook();
        });
    }
});

// --- Fonctions principales ---

/**
 * Charge et affiche tous les livres.
 */
async function loadAllBooks() {
    const query = `
        query {
          getAllBooks {
            id
            title
            author
            price
            isbn
            category
          }
        }
    `;
    const data = await executeGraphQL(query);
    if (data && data.getAllBooks) {
        displayBooks(data.getAllBooks);
    }
}

/**
 * Affiche une liste de livres dans le DOM.
 * @param {Array} books - Le tableau d'objets livre.
 */
function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = ''; // Vide la liste actuelle

    if (!books || books.length === 0) {
        booksList.innerHTML = '<div class="col-12"><p class="text-muted text-center">Aucun livre trouvé.</p></div>';
        return;
    }

    books.forEach(book => {
        const bookCard = `
            <div class="col-md-4 mb-4">
             <div class="card book-card h-100">
              <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                <p class="card-text">
                    <strong>Prix:</strong> $${book.price ? book.price.toFixed(2) : 'N/A'}<br>
                    <strong>ISBN:</strong> ${book.isbn}<br>
                    <strong>Catégorie:</strong> ${book.category}
                </p>
              </div>
              <div class="card-footer bg-white border-0">
                <button class="btn btn-sm btn-outline-warning me-2" onclick="editBook('${book.id}')">Modifier</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteBook('${book.id}')">Supprimer</button>
              </div>
             </div>
            </div>`;
        booksList.innerHTML += bookCard;
    });
}

/**
 * Ajoute un nouveau livre en utilisant les valeurs du formulaire.
 */
async function addNewBook() {
    // Récupération des valeurs du formulaire
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const price = parseFloat(document.getElementById('price').value);
    const isbn = document.getElementById('isbn').value;
    const category = document.getElementById('category').value;

    // Vérification simple (le 'required' du HTML devrait déjà bloquer)
    if (!title || !author || !price || !isbn || !category) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const mutation = `
        mutation CreateBook($title: String!, $author: String!, $price: Float!, $isbn: String!, $category: Category!) {
          createBook(title: $title, author: $author, price: $price, isbn: $isbn, category: $category) {
            id
            title
          }
        }
    `;

    // **POINT CLÉ** : Création de l'objet 'variables'
    // Les clés ici (title, author...) doivent correspondre aux noms
    // des variables ($title, $author...) dans la mutation.
    const variables = {
        title: title,
        author: author,
        price: price,
        isbn: isbn,
        category: category
    };

    // Exécution de la mutation en passant les variables
    const data = await executeGraphQL(mutation, variables);

    if (data && data.createBook) {
        alert(`Livre "${data.createBook.title}" ajouté avec succès!`);
        document.getElementById('addBookForm').reset(); // Vide le formulaire
        loadAllBooks(); // Recharge la liste des livres
    } else {
        alert("Échec de l'ajout du livre. Vérifiez la console.");
    }
}

/**
 * Recherche des livres par titre.
 */
async function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) {
        loadAllBooks(); // Si la recherche est vide, tout recharger
        return;
    }

    const query = `
      query SearchBooks($title: String!) {
        searchBooks(title: $title) {
          id
          title
          author
          price
          isbn
          category
        }
      }
    `;
    const data = await executeGraphQL(query, { title: searchTerm });
    if (data) {
        displayBooks(data.searchBooks);
    }
}

/**
 * Filtre les livres par catégorie.
 */
async function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    if (!category) {
        loadAllBooks(); // Si "Toutes" est sélectionné, tout recharger
        return;
    }

    const query = `
      query GetBooksByCategory($category: Category!) {
        getBooksByCategory(category: $category) {
          id
          title
          author
          price
          isbn
          category
        }
      }
    `;
    const data = await executeGraphQL(query, { category: category });
    if (data) {
        displayBooks(data.getBooksByCategory);
    }
}

/**
 * Supprime un livre par son ID.
 */
async function deleteBook(bookId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre?')) {
        return;
    }

    const mutation = `
      mutation DeleteBook($id: ID!) {
        deleteBook(id: $id)
      }
    `;
    const data = await executeGraphQL(mutation, { id: bookId });
    if (data && data.deleteBook) {
        alert('Livre supprimé avec succès!');
        loadAllBooks(); // Recharger la liste
    } else {
        alert("Échec de la suppression.");
    }
}

/**
 * Modifie un livre (version simplifiée : met à jour le prix).
 */
async function editBook(bookId) {
    const newPriceStr = prompt('Entrez le nouveau prix (ex: 29.99):');
    if (newPriceStr === null) return; // Annulé par l'utilisateur

    const newPrice = parseFloat(newPriceStr);
    if (isNaN(newPrice) || newPrice <= 0) {
        alert("Veuillez entrer un prix valide.");
        return;
    }

    const mutation = `
      mutation UpdateBook($id: ID!, $price: Float) {
        updateBook(id: $id, price: $price) {
          id
          title
          price
        }
      }
    `;
    const data = await executeGraphQL(mutation, {
        id: bookId,
        price: newPrice
    });

    if (data && data.updateBook) {
        alert(`Prix du livre "${data.updateBook.title}" mis à jour à $${data.updateBook.price.toFixed(2)}!`);
        loadAllBooks(); // Recharger la liste
    } else {
        alert("Échec de la mise à jour.");
    }
}