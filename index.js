var autocomplete=require("./autocomplete.js");
firebase = require('firebase');
var {
    sel,
    selAll,
    create
} = require("./utility.js");

var firebaseConfig = {
    apiKey: "AIzaSyDnbW82o5P_oiUEzC1sEfiBPa4nfYZUY4s",
    authDomain: "kstack-a5ac5.firebaseapp.com",
    databaseURL: "https://kstack-a5ac5.firebaseio.com",
    projectId: "kstack-a5ac5",
    storageBucket: "kstack-a5ac5.appspot.com",
    messagingSenderId: "875471920855",
    appId: "1:875471920855:web:84c621dc7b94f249"
};

var topics=[];

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


let auth = firebase.auth();
var signedUp = false;
let db = firebase.firestore();

sel("#signin").addEventListener("click", function () {
    signIn(sel("#username").value, sel("#pwd").value);
});

sel("#signup").addEventListener("click", function () {
    signedUp = true;
    var gender = sel("#m").checked ? sel("#m").value : sel("#f").value;
    var name = sel("#username").value;
    var email = sel("#email").value;
    var pass = sel("#pwd").value;
    
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(() => {
        return db.collection("users").add({
            gender,
            name,
            email,
            uid: firebase.auth().currentUser.uid
        })
    }).then((data) => {
        return db.collection("topics").get();
    }).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             topics.push(doc.data().title);
        });
        console.log(topics);
        sel("#master").innerHTML=sel("#temp").innerHTML;
    }).catch ((err) => {
        console.log(err);
        signedUp = false;
    })
});

// auth.onAuthStateChanged(function (authdata) {
//     if (authdata && (!signedUp)) {
//         window.open("home.html", "_self");
//         return;
//     } else {
//         console.log("Signed out");
//     }
// });


function signIn(email, pass) {
    auth.signInWithEmailAndPassword(email, pass).catch((err) => alert(err));
}










