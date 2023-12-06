import { setLoggedIn, isLoggedIn } from './model.js';
import { navigateToPage } from './router.js';

const SCOPE = 'https://www.googleapis.com/auth/blogger';
const DISCOVERY = 'https://www.googleapis.com/discovery/v1/apis/blogger/v3/rest';

let tokenClient;
let token;
let button = document.getElementById('sign-in-or-out-button');
let div = document.getElementById('auth-status');


function handleAuthClick() {

    if (isLoggedIn()) {
        
        logout();
        if (button)
            button.innerHTML = 'Anmelden';
        if (div)
            div.innerHTML = 'Abgemeldet bei Google';
    } else {
       
        login();
        if (button)
            button.innerHTML = 'Abmelden';
        if (div)
            div.innerHTML = 'Angemeldet bei Google';
    }
}

function login() {
    let loginInfo = document.getElementById("login_info");
    loginInfo.classList.add('logged-in');
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
        token = JSON.parse(storedToken);
        setLoggedIn(true, token);
        navigateToPage(window.location.pathname);
        if (button) button.innerHTML = 'Abmelden';
        if (div) div.innerHTML = 'Angemeldet bei Google';
        
        return;
    }

    tokenClient.callback = (resp) => {
        if (resp.error !== undefined) {
            throw(resp);
        }
        console.log("---------setSigninStatus: Angemeldet---------");
        token = resp;
        localStorage.setItem('userToken', JSON.stringify(resp)); // Storing token
        setLoggedIn(true, resp);
        navigateToPage(window.location.pathname);
    }

    if (token) {
        tokenClient.requestAccessToken({prompt: ''});
    } else {
        tokenClient.requestAccessToken();
    }
}
function logout() {
    let loginInfo = document.getElementById("login_info");
    loginInfo.classList.remove('logged-in');
    console.log("---------setSigninStatus: Abgemeldet---------");
    localStorage.removeItem('userToken'); 
    setLoggedIn(false);
    navigateToPage('/');
}

function handleClientLoad() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '26901513547-8ae4n8ut9sh5l7839qjsknf4nminls6k.apps.googleusercontent.com',
        scope: SCOPE,
        callback: '', 
    });
    button.addEventListener('click', handleAuthClick);

   
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
        token = JSON.parse(storedToken);
        login(); 
    }
}

window.addEventListener("load", handleClientLoad);
