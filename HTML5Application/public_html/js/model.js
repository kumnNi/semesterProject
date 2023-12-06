// private Variablen und Funktionen

const pathSelf = 'https://www.googleapis.com/blogger/v3/users/self';
const pathGetBlogs = pathSelf + '/blogs';
const pathBlogs = 'https://www.googleapis.com/blogger/v3/blogs';
let loggedIn = false;
let reqInstance = null;

let blogs= new Map();
let posts= new Map();
let comments= new Map();
const DELAY = 2000;

// Constructor functions for Blog, Post, and Comment objects
function Blog(gBlog) { 
    this.id= gBlog.id;
    this.name= gBlog.name,
    this.description= gBlog.description,
    this.publishedDate=gBlog.published,
    this.updatedDate= gBlog.updated,
    this.selfLink = gBlog.selfLink,
    this.postsTotalItems= gBlog.posts.totalItems;

}

function Post(gPost) { 
    this.id = gPost.id,
    this.blogId = gPost.blog.id,
    this.title = gPost.title,
    this.publishedDate=gPost.published,
    this.updatedDate= gPost.updated,
    this.content = gPost.content,
    this.commentsTotalItems = gPost.replies.totalItems;
}

function Comment(gComment) {
  this.id = gComment.id,
  this.blogId = gComment.blog.id,
  this.postId = gComment.post.id,
  this.author = gComment.author.displayName,
  this.publishedDate = gComment.published,
  this.updatedDate = gComment.updated,
  this.content = gComment.content;
}
var setFormatDates=function(long) {
    this.formatPublishedDate= formatDate(this.publishedDate, long);
    this.formatUpdatedDate= formatDate(this.updatedDate, long);
};
    
Blog.prototype = {
    constructor: Blog,
    setFormatDates: setFormatDates
};

Post.prototype = {
    constructor: Post,
    setFormatDates: setFormatDates
};

Comment.prototype = {
    constructor: Comment,
    setFormatDates: setFormatDates
};

function getPath(bid, pid, cid) {
    let path = pathBlogs;
    if (bid)
        path += '/' + bid;
    if (pid)
        path += '/posts/' + pid;
    if (cid)
        path += "/comments/" + cid;
    return path;
}

// Formatiert den Datum-String in date in zwei mögliche Datum-Strings: 
// long = false: 24.10.2018
// long = true: Mittwoch, 24. Oktober 2018, 12:21
function formatDate(date, long) {
    const options = long
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    : { year: 'numeric', month: '2-digit', day: '2-digit' };

    
    const localDate = new Date(date);
    return localDate.toLocaleString('de-DE', options);
}

function makePromise(value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, DELAY);
    });
}

//setFormDates publishForm, updatedForm

// Öffentliche Schnittstelle von Model

// Wird nach Login (which = true)/Logout (which = false) aufgerufen.
// token enthält das Token für den Zugriff auf Blogger-Daten.
function setLoggedIn(which, token) {
    loggedIn = which;
    if (token) {
        // Hier wird ein Request-Objekt mit Default-Header erzeugt
        // Im Header wird das Token für die Anfrage bei Blogger-API gesetzt
        reqInstance = axios.create({
            headers: {
                Authorization: `${token.token_type} ${token.access_token}`,
              
            }
        });
    }
    if (!token)
        reqInstance = null;
}
// Getter für loggedIn
function isLoggedIn() {
    return loggedIn;
}
// Liefert den angemeldeten Nutzer mit allen Infos
async function getSelf() {
    let result = await reqInstance.get(pathSelf);
  
    return result.data;
}
// Liefert alle Blogs des angemeldeten Nutzers
async function getAllBlogs() {
    let result = await reqInstance.get(pathGetBlogs);
    let blogs = [];
    if (result.data.items){
        //blogs = result.data.items;
        for(let b of result.data.items){
            blogs.push(new Blog(b));
        }
    }
  
    return blogs;
}
// Liefert den Blog mit der Blog-Id bid
async function getBlog(bid) {
    let path = getPath(bid);
    let result = await reqInstance.get(path);
    return new Blog(result.data);
}
async function getAllPostsOfBlog(bid) {
    let path = getPath(bid) + '/posts';
    let result = await reqInstance.get(path);
    let posts = [];

    console.log('Response data:', result.data);

    if (result.data.items) {
      for (let p of result.data.items) {
        posts.push(new Post(p));
      }
    }
    console.log('Posts:', posts);
    return posts;
}

// Liefert den Post mit der Post-Id pid im Blog mit der Blog-Id bid
async function getPost(bid, pid) {
    let path = getPath(bid, pid);
    let result = await reqInstance.get(path);
    return new Post(result.data);
}
// Liefert alle Kommentare zu dem Post mit der Post-Id pid 
// im Blog mit der Blog-Id bid
async function getAllCommentsOfPost(bid, pid) {
    let path = getPath(bid, pid) + "/comments"; // todo double check if path is correct
    let result = await reqInstance.get(path);
    let comments = [];
    if (result.data.items)
        //comments = result.data.items;
         for(let c of result.data.items){
            comments.push(new Comment(c));
        }
    return comments;
}

// Löscht den Kommentar mit der Id cid zu Post mit der Post-Id pid 
// im Blog mit der Blog-Id bid 
async function deleteComment(bid, pid, cid) {
    var path = getPath(bid, pid, cid);
    let result = await reqInstance.delete(path);
    return result.data;
}

// Fügt dem Blog mit der Blog-Id bid einen neuen Post 
// mit title und content hinzu.
async function addNewPost(bid, title, content) {
    var body = {
        kind: "blogger#post",
        title: title,
        blog: {
            id: bid
        },
        content: content
    };
    let path = getPath(bid) + '/posts';
    let result = await reqInstance.post(path, body);
    return new Post(result.data);
}
// Aktualisiert title und content im geänderten Post 
// mit der Post-Id pid im Blog mit der Blog-Id bid.
async function updatePost(bid, pid, title, content) {
    var body = {
        kind: "blogger#post",
        title: title,
        id: pid,
        blog: {
            id: bid
        },
        content: content
    };
    let path = getPath(bid, pid);
    let result = await reqInstance.put(path, body);
    return new Post(result.data);
}
// Löscht den Post mit der Post-Id pid im Blog 
// mit der Blog-Id bid.
async function deletePost(bid, pid) {
    console.log("deletePost model");
    var path = getPath(bid, pid);
    let result = await reqInstance.delete(path);
    let data = result.data;
    if (result.status === 204)
        return true;
    else
        return false;
}

async function getEmptyPost() {
    return makePromise(new Post(0, "", ""));
}




export { setLoggedIn, isLoggedIn, getSelf, getAllBlogs, getBlog,
        getAllPostsOfBlog, getPost, getAllCommentsOfPost, deleteComment,
        addNewPost, updatePost, deletePost,getEmptyPost
        
    };



