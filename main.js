const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
  });

  function addBook() {
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookSubmit = document.getElementById('bookSubmit').value;
   
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, bookYear, bookSubmit);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }
   
  function generateBookObject(id, title, author, bookYear) {
    return {
        id,
        title,
        author,
        bookYear
        
    }
  }
  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

  
    for (const bookItem of books) {

      const bookElement = makeBook(bookItem);
     
      
      if (!bookItem.isCompleted) {
        uncompletedBookList.append(bookElement);
      }else{
        completedBookList.append(bookElement);
      }
    }
  });

  function makeBook(bookObject) {

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;
   
    const authorBook = document.createElement('p');
    authorBook.innerText = bookObject.author;

    const yearBook = document.createElement('p');
    yearBook.innerText = bookObject.bookYear;

    const itemBook = document.createElement('div');
    itemBook.classList.add('book_item');
    itemBook.append(bookTitle, authorBook, yearBook);
    itemBook.setAttribute('id', `unreadBook-${bookObject.id}`);

    if (bookObject.isCompleted) {
      const btnGreen = document.createElement('button');
      btnGreen.classList.add('green');
      btnGreen.innerText = "Belum selesai di Baca";
   
      btnGreen.addEventListener('click', function () {
        undoBookFromCompleted(bookObject.id);
      });
   
      const btnRed = document.createElement('button');
      btnRed.classList.add('red');
      btnRed.innerText = "Hapus Buku";
   
      btnRed.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
      });
   
      const action = document.createElement('div');
      action.classList.add('action');
      action.append(btnGreen, btnRed);

      itemBook.append(action);
    } else {
      const btnGreen = document.createElement('button');
      btnGreen.classList.add('green');
      btnGreen.innerText = "Selesai di Baca";
   
      btnGreen.addEventListener('click', function () {
        addBookToCompleted(bookObject.id);
      });
   
      const btnRed = document.createElement('button');
      btnRed.classList.add('red');
      btnRed.innerText = "Hapus Buku";
   
      btnRed.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
      });
   
      const action = document.createElement('div');
      action.classList.add('action');
      action.append(btnGreen, btnRed);

      itemBook.append(action);
    }
   
    return itemBook;

  }

  function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }
  
  function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
   
   
  function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}


document.addEventListener('DOMContentLoaded', function () {
  const submitForm /* HTMLFormElement */ = document.getElementById('bookSubmit');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});