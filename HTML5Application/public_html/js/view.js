import * as presenter from './presenter.js';


function setSelected(ul, blogId) {
    let li = null;
    let lis = ul.querySelectorAll('li');
    // Alle zurücksetzten, selektierten suchen
    for (let l of lis) {
        l.classList.remove('selected');
        if (l.dataset.id === blogId)
            li = l;
    }
    if (li)
        li.classList.add('selected');
}

function setDataInfo(element, object) {
    let cont = element.innerHTML;
    for (let key in object) {
        let rexp = new RegExp("%" + key + "%", "g");
        cont = cont.replace(rexp, object[key]);
    }
    element.innerHTML = cont;
}

function setNavButtons(templ) {
// Klonen des Button-Komponententemplate
    let buttons = document.getElementById("buttons_edit_delete").cloneNode(true);
    buttons.removeAttribute("id");
    // Buttons in Navigation einsetzen
    let nav = templ.querySelector("nav");
    nav.append(buttons);
}

function renderNav(blogId, blogs) {

    console.log("view.nav");
    let ul = document.getElementById('nav').cloneNode(true);
    ul.removeAttribute("id");
    let liTempl = ul.firstElementChild;
    liTempl.remove();
    for (let b of blogs) {
        let li = liTempl.cloneNode(true);
        if (b.id === blogId)
            li.classList.add('selected');
        ul.appendChild(li);
        setDataInfo(ul, b);
    }
    setSelected(ul, blogId);
    return ul;
}

function updateNavSelection(blogId) {
    console.log("Hier wird nur die Selektion verändert");
    setSelected(document.querySelector('#nav_slot ul'), blogId);
}

function renderBlogInfo(blog) {
    console.log("-> pati blog: " + JSON.stringify(blog));

    let div = document.getElementById("blog_info").cloneNode(true);
    div.removeAttribute("id");
    blog.setFormatDates(false);
    setDataInfo(div, blog);
    return div;
}

function renderBlogOverview(data,bid) {
    function handleDelete(event) {
        let source = event.target.closest('LI');
        if (source) {
            let action = source.dataset.action;
            if (action === "deletePost" && confirm(`Wollen Sie den Post wirklich löschen?`)) {
                
                // Aufruf der zugehörigen Presenter-Methode
                
                let id = source.dataset.id;
                presenter[action](id);
            }
        }
    }
    let page = document.getElementById('blog_overview').cloneNode(true);
    setNavButtons(page);
    page.removeAttribute('id');
  
    let articleTemplate = page.querySelector("article");
    articleTemplate.remove();
    setDataInfo(page,{blogId:bid});
    
    for (let p of data) {
        let article = articleTemplate.cloneNode(true);
        p.setFormatDates(false);
        setDataInfo(article, p);
        page.appendChild(article);
    }
    page.addEventListener("click", handleDelete);
    return page;
}

function renderComments2(data) {
    console.log("-> data 22222: " + JSON.stringify(data));

    function handleDelete(event) {
        let source = event.target.closest('button');
        if (source) {
            let action = source.dataset.action;
            console.log("Action to perform: ", action);

            if (action === "deleteComment" && confirm(`Wollen Sie den Kommentar wirklich löschen?`)) {
                let id = source.dataset.id;
                presenter[action](id);
            }
        }
    }
    let page = document.getElementById('comments').cloneNode(true);
   
    page.removeAttribute('id');
   
    let articleTemplate = page.querySelector("article");
    articleTemplate.remove();
    
    for (let p of data) {
        let article = articleTemplate.cloneNode(true);
        p.setFormatDates(false);
        setDataInfo(article, p);
        page.appendChild(article);
    }
    page.addEventListener("click", handleDelete);
    return page;
}

function renderPostDetail(post, comments) {
    
    console.log("View: render von detailView");
    function handleDelete(event) {
        let source = event.target.closest('LI');
        if (source) {
            let action = source.dataset.action;
            if (action === "deletePost" && confirm(`Wollen Sie diese Post wirklich löschen?`)) {
                let id = source.dataset.id;
                presenter[action](id);
            }
        }
    }
    let page = document.getElementById('detail').cloneNode(true);
  
    setNavButtons(page);
    post.setFormatDates(true);
    page.removeAttribute("id");
    setDataInfo(page, post);
    let comments2 = renderComments2(comments);
    page.append(comments2);
    page.addEventListener("click", handleDelete);
    return page;
}

function renderEditView(data){
    
    function handleSave(event) {
        event.preventDefault();
        let action = event.target.dataset.action;
        if (action === "save" && confirm(`Wollen Sie die Änderungen wirklich speichern?`)) {
            data.title = form.titel.value;
            data.content = form.querySelector("div").innerHTML;
            
            presenter[action](data);
        }
        
        else if (action === "cancel") {
            console.log("Cancel gedrückt!");
            let blogId = event.target.dataset.id;
            let postId = data.postId;
            presenter[action](blogId, postId);
        }
    }
    
    console.log("View: render von editView");
    // Klonen des Template-Knotens für die Seite
    let page = document.getElementById("edit").cloneNode(true);
    // Entfernen des Id-Attributs (keine Doubletten!)
    page.removeAttribute('id');
    // Fuellen des Templates mit den Objektdaten
    setDataInfo(page, data);
    console.log(`Presenter: Data for Edit( ${data})`);
    
    let form = page.querySelector("form");
    
    console.log("View: bis hier");
    // Eventhandler wird für die Seite gesetzt (Delegation)
    page.addEventListener("click", handleSave);
    return page;
}

function renderAddPost(data){
    function handleSave(event) {
        event.preventDefault();
        let action = event.target.dataset.action;
        if (action === "save" && confirm(`Wollen Sie die neue Post wirklich speichern?`)) {
            data.title = form.titel.value;
            data.content = form.content.value;
            
            presenter[action](data);
        }
       
        else if (action === "cancel") {
            console.log("Cancel gedrückt!");
            let blogId = event.target.dataset.id;
            let postId = data.postId;
            presenter[action](blogId, postId);
        }
    }
    console.log("View: render von Add neu Post");
    // Klonen des Template-Knotens für die Seite
    let page = document.getElementById("add").cloneNode(true);
    // Entfernen des Id-Attributs (keine Doubletten!)
    page.removeAttribute('id');
    // Fuellen des Templates mit den Objektdaten
    setDataInfo(page, data);
    console.log(`Presenter: neu Data to insert ( ${data})`);
    
    let form = page.querySelector("form");
    
    console.log("View: bis hier");
    // Eventhandler wird für die Seite gesetzt (Delegation)
    page.addEventListener("click", handleSave);
    
    return page;
    
    
}

export { renderBlogInfo, renderNav, updateNavSelection, 
    renderBlogOverview,renderPostDetail, renderComments2,
     renderEditView,renderAddPost};
//setDataInfo
//setSelected
