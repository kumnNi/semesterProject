
import * as presenter from './presenter.js';

// Private Variablen und Funktionen

let mapRouteToHandler = new Map();

// Fügt eine neue Route (URL, auszuführende Funktion) zu der Map hinzu
function addRoute(route, handler) {
    mapRouteToHandler.set(route, handler);
}

// Wird als EventHandler aufgerufen, sobald die Pfeiltasten des Browsers betätigt werden
function handleRouting() {
    console.log("Navigation zu URL: " + window.location.pathname);
    const currentPage = window.location.pathname.split('/')[1];
    let routeHandler = mapRouteToHandler.get(currentPage);
    if (routeHandler === undefined)
        routeHandler = mapRouteToHandler.get(''); //Startseite
    routeHandler();
}

function initRouter() {
    // Sorgt dafür, dass die Startseite angezeigt wird.
    addRoute('', function () {
        presenter.showStartPage();
    });
    // Sorgt dafür, dass die Blog-Übersicht angezeigt wird.
    addRoute('blogOverview', function () {
        var blogId = window.location.pathname.split('blogOverview/')[1].trim();
        console.log("-> blogId: " + blogId);
        presenter.showBlogOverview(blogId);
    });

    // Detailseite für Person
    addRoute('detail', function () {
        // Aus dem location.hash die Objekt id lesen
        var ids = window.location.pathname.split('/detail/')[1].trim().split("/");
        let blogId = ids[0]; 
        let postId = ids[1];
        presenter.showPostDetail(blogId, postId);
    });
    
    // Editor Edit
    addRoute('edit', function () {
        // Aus dem location.hash die Objekt ids lesen
        var ids = window.location.pathname.split('/edit/')[1].trim().split("/");
        let blogId = ids[0];
        let postId = ids[1];
        presenter.showEdit(blogId, postId);
    });
    
    // Insert new Post
    addRoute('add', function () {
        // Aus dem location.hash die Objekt ids lesen
        var id = window.location.pathname.split('/add/')[1].trim();
        presenter.showAdd(id);
    });
    

    window.addEventListener('popstate', (event) => {
        handleRouting();
    });
    // Wird benötigt für initiales Routing nach Laden der Seite, da hier 
    // kein popstate-Event erzeugt wird. 
    window.addEventListener("load", handleRouting);
}

// Öffentliche Funktionen

// Wird aufgerufen, wenn zu einer anderen Adresse navigiert werden soll
function navigateToPage(url) {
    history.pushState(null, "", url);
    handleRouting();
}

// Wird als Eventhandler an ein <a>-Element gebunden
function handleNavigationEvent(event) {
    event.preventDefault();
    let url = event.target.href;
    navigateToPage(url);
}


// Initalisierung des Routers
initRouter();

export {navigateToPage, handleNavigationEvent};


