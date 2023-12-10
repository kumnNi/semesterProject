
import * as router from './router.js';
import * as model from './model.js';
import * as view from './view.js';


// Private Variablen und Funktionen
let state = {};
resetState();

function resetState() {
    state = {
        init: false,
        blogId: -1,
        postId: -1,
        owner: null,
        
        detail: false,
        navSlotUpdate: true,
        selectionUpdate: true,
        blogInfoSlotUpdate: true,
        commentsSlotUpdate: true
    };
}
async function fillNavSlot() {
    console.log("fillNavSlot start: " + new Date(Date.now()).toLocaleTimeString('de-DE'));
    state.navSlotUpdate = false;
    let blogs = await model.getAllBlogs();
    console.log(blogs[0]);
    
    let elem = view.renderNav(state.blogId, blogs);
    replace('nav_slot', elem);
    console.log("fillNavSlot end: " + new Date(Date.now()).toLocaleTimeString('de-DE'));
}
async function fillBlogInfoSlot() {
    state.blogInfoSlotUpdate = false;
    let result = await model.getBlog(state.blogId);
    let elem = view.renderBlogInfo(result, state.blogId);
    replace('blog_info_slot', elem);
}
// Aktualisiert die allgemeinen Elemente der Seite
async function updatePage() {
    console.log("Presenter: Aufruf von updatePage()");
    // Nutzer abfragen und Anzeigenamen als owner setzen
    
    console.log(`Presenter: Nutzer*in ${state.owner} hat sich angemeldet.`);
    // Alle Blogs des angemeldeten Nutzers abfragen
  
    if (!state.init ) {
        console.log("Initialisierung von Eventhandler.");
        document.body.addEventListener("click", handleClicks);
        let self = await model.getSelf();
        state.owner = self.displayName;
        //for anmeldung zeigen
        state.init = true;
    }
    if (state.blogInfoSlotUpdate) fillBlogInfoSlot();
    
    if (state.navSlotUpdate) fillNavSlot();
    else if (state.selectionUpdate) {
        console.log('Einstellen der Selektion.');
        state.selectionUpdate = false;
        view.updateNavSelection(state.blogId);
    }
    

}
let loginPage = function () {
    console.log("Presenter: Aufruf von loginPage()");
    if (state.owner !== null)
        console.log(`Presenter: Nutzer*in ${state.owner} hat sich abgemeldet.`);
    else console.log("Nutzer ist abgemeldet!");
    resetState();
};



// Öffentliche Schnittstelle von Presenter
// 
// Zeigt die Startseite an.
function showLoginInfo() {
    let loginInfo = document.getElementById("login_info");
    if (state.owner) {
        loginInfo.textContent = state.owner +"";
        loginInfo.classList.add('logged-in');
    } else {
        loginInfo.textContent = "Abgemeldet!";
        loginInfo.classList.remove('logged-in');
    }
}

async function showStartPage() {
    console.log("Aufruf von presenter.showStartPage()");
    // Wenn vorher noch nichts angezeigt wurde, d.h. beim Einloggen
    if (model.isLoggedIn()) { // Wenn der Nutzer eingeloggt ist
        let blogs = await model.getAllBlogs();

        state.blogId = blogs[0].id;
        let elem = view.renderNav(state.blogId, blogs);
        replace('nav_slot', elem);
        state.navSlotUpdate = false;
        // Setzen der noch fehlenden Elemente der Seite
        await updatePage(); 
        console.log("state.owner:", state.owner);

        showLoginInfo();

        // Weiter zur Übersicht für ersten Blog
        router.navigateToPage(`/blogOverview/${state.blogId}`);
    }
    if (!model.isLoggedIn()) { // Wenn der Nuzter eingelogged war und sich abgemeldet hat
        //Hier wird die Seite ohne Inhalt angezeigt
        resetState();
        let navInfoSlot = document.getElementById('nav_slot');
        navInfoSlot.innerHTML = '';
        let blogInfoSlot = document.getElementById('blog_info_slot');
        blogInfoSlot.innerHTML = '';
        let mainSlot = document.getElementById('main-content_slot');
        mainSlot.innerHTML = '';

        let loginInfo = document.getElementById('login-info');
        if (loginInfo) { 
            loginInfo.remove();
        }

        loginPage();
    }
}

function loadState() {
    const storedOwner = localStorage.getItem('owner');
    if (storedOwner) {
        state.owner = storedOwner; 
        showLoginInfo(); 
    }
}


async function showBlogOverview(bid) {
    console.log(`Presenter: Aufruf von showOverview(${bid})`);
    // Nicht auf Detail-View
    state.detail = false;
    if (bid !== state.blogId) {
        state.blogId = bid;
        state.blogInfoSlotUpdate = true;
        state.selectionUpdate = true;
    }
    state.postId = -1;
    
    updatePage();
    let posts = await model.getAllPostsOfBlog(bid);
    console.log("posts: "+ posts);
    let page = view.renderBlogOverview(posts,bid);
    replace('main-content_slot', page);
    
}

async function showPostDetail(bid, pid) {
    console.log(`Aufruf von presenter.showPostDetail(${bid}, ${pid})`);
    state.blogId = bid;
    state.postId = pid;
    state.detail = true;
    console.log(`--------------- Alle Comments des Posts ${state.postId} --------------- `);
    
    await updatePage();
    let post = await model.getPost(state.blogId, state.postId);
    let comments = await model.getAllCommentsOfPost(state.blogId, state.postId);
    console.log("-> postpostpostpost: " + JSON.stringify(post));
    let page = view.renderPostDetail(post, comments);
    replace('main-content_slot', page);
}

async function fillCommentsSlot() {
    //state.commentsSlotUpdate = false;
    let comments = await model.getAllCommentsOfPost(state.blogId, state.postId);
    if (comments) {
        let com = view.renderComments2(comments);
        replace('comments_slot', com);
    }
}

function replace(id, element) {
    let slot = document.getElementById(id);
    let content = slot.firstElementChild;
    if (content)
        content.remove();
    if (element) {
        slot.append(element);
    }
}

function handleClicks(event) {
    let source = null;
    // Behandelt werden clicks auf a-Tags, Buttons  
    // und Elemente, die in ein Li-Tag eingebunden sind.
    switch (event.target.tagName) {
        case "A":
            if(event.target.href.includes(window.location.host)) router.handleNavigationEvent(event);
            break;
        case "BUTTON" :
            source = event.target;
            break;
        default:
            source = event.target.closest("LI");
            break;
    }
    if (source) {
        let path = source.dataset.path;
        if (path)
            router.navigateToPage(path);
    }
}

// Editorseite für das Editieren eines  Blog-Content
async function showEdit(blogId, postId) {
    console.log(`Presenter: Aufruf von showEdit(${blogId}, ${postId})`);
    state.blogId = blogId;
    state.postId = postId;
    state.detail = false;
    // Aktualisieren der allgemeinen Elemente
    // Daten können parallel abgefragt werden.
    const post = await  model.getPost(blogId,postId);
    let page = view.renderEditView(post);
    replace('main-content_slot', page);
}

async function save(obj) {
    console.log(`Presenter: Aufruf von save für id: ${obj.id}`);
    console.log(obj);
    let result;
    
    if(!obj.id){
        result = await model.addNewPost(obj.blogId, obj.title, obj.content );
        alert(`Speichern des neuen Posts  ${result.title} war erfolgreich`);
        state.navSlotUpdate = true;
    }
    
   else {
       result = await model.updatePost(obj.blogId, obj.id, obj.title,obj.content );
           alert(`Speichern des updates Posts  ${result.title} war erfolgreich`); 
        }
    // Header-Infos müssen aktualisiert werden
    state.blogInfoSlotUpdate = true;
    
    
    // Nach dem Speichern auf jeden Fall zur Detail Seite des geänderten Post
    router.navigateToPage(`/detail/${result.blogId}/${result.id}`);
} 

// Editorseite für das Hinzufügen eines neuen Blog
async function showAdd(id) {
    console.log(`Presenter: Aufruf von showAdd(${id})`);
    state.blogId = id;
    state.postId = -1;
    // Aktualisieren der allgemeinen Elemente
    updatePage();
    const post = {blogId:id};
    
    let page = view.renderAddPost(post);
    replace('main-content_slot', page);
}
// Aktion für Cancel im Editor, Navigation zu Detail oder Overview
function cancel(blogId, postId) {
    console.log(`Presenter: Aufruf von cancel(${blogId}, ${postId})`);
    if (state.detail) {
        router.navigateToPage(`/detail/${blogId}/${postId}`);
    } else
        router.navigateToPage("/overview/" + blogId);
}

async function deletePost(postId) {
    console.log(`Presenter: Aufruf von deletePost(${state.blogId}, ${postId})`);
    console.log("deletePost presenter");
    let removed = await model.deletePost(state.blogId, postId);
    alert(`Diese Post wurde gelöscht: ${removed.name}`);
    if (removed) { 
        state.blogInfoSlotUpdate = true;
        state.navSlotUpdate = true;
        router.navigateToPage("/blogOverview/" + state.blogId);
        
    }
}
async function deleteComment(commentId) {
    console.log(`Presenter: Aufruf von deleteComment(${state.blogId}, ${state.postId}, ${commentId})`);
    console.log("deleteComment presenter");


    let removed = await model.deleteComment(state.blogId, state.postId, commentId);
    console.log("Deleted comment:", removed); // Log the deletion response

    alert("Dieser Kommentar wurde gelöscht.");
    state.commentsSlotUpdate =  true;
   // Fetching updated post
    let post = await model.getPost(state.blogId, state.postId);

    await showPostDetail(state.blogId, state.postId)
    await updatePage();
    
}

showStartPage();

export { showStartPage, showBlogOverview, showPostDetail, showLoginInfo, fillCommentsSlot, fillBlogInfoSlot, 
    fillNavSlot, showEdit,showAdd,save,cancel,deletePost, deleteComment};
