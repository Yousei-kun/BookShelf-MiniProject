//navbar-related

window.onscroll = function() {scrollFunctionNavbar()};

function scrollFunctionNavbar() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.querySelector("nav").style.padding = "0";
    } else {
        document.querySelector("nav").style.padding = "1vh";
    }
}

let navMenu = document.getElementById("nav-list-mobile");
let bgDark = document.getElementById("darken");

function navMobile() {
    if (navMenu.style.display === "block") {
        navMenu.style.display = "none";
        bgDark.style.display = "none";
    }
    else {
        navMenu.style.display = "block";
        bgDark.style.display = "block";
    }
}

function navMobileClose() {
    if (navMenu.style.display === "block") {
        navMenu.style.display = "none";
        bgDark.style.display = "none";
    }
    else {
        navMenu.style.display = "block";
        bgDark.style.display = "block";
    }
}

// Local & Session Storage Related Functions

let unreadShelf = document.getElementById("book-display");
let readShelf = document.getElementById("read-book-display");

function checkStorageAvailability() {
    return typeof(Storage) !== "undefined"
}

function renderShelf() {

    let innerText = "";
    let iter = 4;

    if (sessionStorage.getItem("readBook") === null || sessionStorage.getItem(("readBook")) === "" || sessionStorage.getItem(("readBook")) === "null") {
        innerText = "";
        readShelf.innerHTML = innerText;
    }

    else {
        let readBook = JSON.parse(sessionStorage.getItem("readBook"));

        let innerText = "<div class='row'>";
        let iter = 4;

        for (const item of readBook) {
            if (iter === 0) {
                innerText += "</div>"
                innerText += "<div class='row'>"
                iter = 4;
            }
            innerText +=
                `
            <div class="card card-dark">
                <div class="card-details">
                    <div class="book-name" id="read-title-${item.id}">
                        ${item.title}
                    </div>
                    <div class="book-detail" id="read-author-${item.id}">
                        ${item.author}
                    </div>
                    <div class="book-price text-muted" id="read-year-${item.id}">
                        ${item.year}
                    </div>
                    <div class="button-util">
                        <div class="btn btn-book" id="${item.id}" onclick="moveShelf(this.id, 1)" >Not Yet Read</div>
                        <div class="btn btn-danger" id="${item.id}" onclick="deleteModalPopUp(this.id, this.title, 1)" >Delete Book</div>
                    </div>
                </div>
            </div>
            `
            iter -= 1;
        }
        readShelf.innerHTML = innerText;
    }

    if (sessionStorage.getItem("unreadBook") === null || sessionStorage.getItem(("unreadBook")) === "" || sessionStorage.getItem(("unreadBook")) === "null") {
        innerText = "";
        unreadShelf.innerHTML = innerText;
    }

    else {
        let unreadBook = JSON.parse(sessionStorage.getItem("unreadBook"));

        innerText = "<div class='row'>";
        iter = 4;

        for (const item of unreadBook) {
            if (iter === 0) {
                innerText += "</div>"
                innerText += "<div class='row'>"
                iter = 4;
            }
            innerText +=
                `
            <div class="card">
                <div class="card-details">
                    <div class="book-name" id="unread-title-${item.id}">
                        ${item.title}
                    </div>
                    <div class="book-detail" id="unread-author-${item.id}">
                        ${item.author}
                    </div>
                    <div class="book-price text-muted" id="unread-year-${item.id}">
                        ${item.year}
                    </div>
                    <div class="button-util">
                        <div class="btn btn-book" id="${item.id}" onclick="moveShelf(this.id, 0)" >Have Read</div>
                        <div class="btn btn-danger" id="${item.id}" onclick="deleteModalPopUp(this.id, this.title, 0)" >Delete Book</div>
                    </div>
                </div>
            </div>
            `
            iter -= 1;
        }
        unreadShelf.innerHTML = innerText;
    }
}

function putReadBook(data){

    if(checkStorageAvailability()){
        let readBook = [];
        if (sessionStorage.getItem("readBook") === "") {
            readBook = [];
        } else {
            readBook = JSON.parse(sessionStorage.getItem("readBook"));
        }
        readBook.unshift(data);
        sessionStorage.setItem("readBook", JSON.stringify(readBook));
    }

    renderShelf()
}

function putBook(data){

    if(checkStorageAvailability()){
        let unreadBook = [];
        if (sessionStorage.getItem("unreadBook") === "") {
            unreadBook = [];
        } else {
            unreadBook = JSON.parse(sessionStorage.getItem("unreadBook"));
        }
        unreadBook.unshift(data);
        sessionStorage.setItem("unreadBook", JSON.stringify(unreadBook));
    }

    renderShelf()
}

function deleteBook(id, read_status, move = 0){
    if (read_status === 1) {
        let books = JSON.parse(sessionStorage.getItem("readBook"));

        for (const index in books){
            if (books[index].id === id){
                let data_deleted = books[index];
                books.splice(index,1);
                sessionStorage.setItem("readBook", JSON.stringify(books));
                renderShelf()
                if (move === 1) {
                    return data_deleted;
                }
                break;
            }
        }
    }

    else if (read_status === 0) {
        let books = JSON.parse(sessionStorage.getItem("unreadBook"));

        for (const index in books){
            if (books[index].id === id){
                let data_deleted = books[index];
                books.splice(index,1);
                sessionStorage.setItem("unreadBook", JSON.stringify(books));
                renderShelf()
                if (move === 1) {
                    return data_deleted;
                }
                break;
            }
        }
    }

    document.getElementById("darken-modal").style.display = "none";
    document.getElementById("modal-fill").innerHTML = "";
}

function moveShelf(id, read_status){
    let data_deleted = deleteBook(id, read_status, 1)

    if (data_deleted.isComplete === false) {
        data_deleted.isComplete = true
        putReadBook(data_deleted)
    }
    else {
        data_deleted.isComplete = false
        putBook(data_deleted)
    }

    renderShelf();
}

window.addEventListener("load", function(){
    if (typeof(Storage) !== "undefined") {

        if (localStorage.getItem("readBook") === null || localStorage.getItem(("readBook")) === "" || localStorage.getItem(("readBook")) === "null") {
            sessionStorage.setItem("readBook", "");
        } else {
            sessionStorage.setItem("readBook", localStorage.getItem("readBook"));
        }

        if (localStorage.getItem("unreadBook") === null || localStorage.getItem(("unreadBook")) === "" || localStorage.getItem(("unreadBook")) === "null") {
            sessionStorage.setItem("unreadBook", "");
        } else {
            sessionStorage.setItem("unreadBook", localStorage.getItem("unreadBook"));
        }

        renderShelf();

    } else{
        alert("Browser yang Anda gunakan tidak mendukung Web Storage")
    }
});

window.addEventListener("beforeunload", function(){
    localStorage.setItem("unreadBook", sessionStorage.getItem("unreadBook"));
    localStorage.setItem("readBook", sessionStorage.getItem("readBook"));
});



//form-input related

function parseBookInput(title,author,year,read, id=''){
    if (id !== '') {
        const row = {
            id: id,
            title: title,
            author: author,
            year: year,
            isComplete: read,
        }
        return row;
    }
    else {
        const row = {
            id: 'A'+new Date().getTime(),
            title: title,
            author: author,
            year: year,
            isComplete: read,
        }
        return row;
    }
}

function submitData() {
    let book_title = document.getElementById("book-title").value;
    let book_author = document.getElementById("book-author").value;
    let book_year = document.getElementById("book-year").value;
    let book_read = document.getElementById("book-read").checked;

    if (book_title.length > 0 && book_author.length > 0 && book_year.length > 0)
    {
        const row = parseBookInput(book_title,book_author,book_year,book_read);
        if (book_read === true) {
            putReadBook(row);
        }
        else {
            putBook(row);
        }
    }
}

function deleteModalPopUp(id, title, read_status) {

    let darken = document.getElementById("darken-modal");
    darken.style.display = "block";

    let innerTextDelete =
        `
        <div class="card card-modal">
            <div class="card-details">
                <div class="modal-delete-header">
                    Confirmation of Book Deletion
                </div>
                <div class="modal-delete-text">
                    Confirm to delete this book?
                </div>
                <div class="button-util">
                    <div class="btn btn-primary" onclick="closeDeleteModalPopUp()" >Close</div>
                    <div class="btn btn-danger" id="${id}" onclick="deleteBook(this.id, ${read_status})" >Delete Book</div>
                </div>
            </div>
        </div>
        `
    document.getElementById("modal-fill").innerHTML = innerTextDelete;
}

function closeDeleteModalPopUp() {
    document.getElementById("darken-modal").style.display = "none";
    document.getElementById("modal-fill").innerHTML = "";
}
