var autocomplete = require("./autocomplete.js");
firebase = require('firebase');
var {
    sel,
    selAll,
    create,
    get
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

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
var topics = {};
var tarr = [];
var notopic = 100;
var title = document.querySelector("#subm");
var gettopic = () => {
    db.collection('topics').get()
        .then((docs) => {
            docs.forEach((doc) => {
                topics[doc.data().title] = doc.data().id;
                notopic += 1;
            })
            console.log(topics);
            tarr = Object.keys(topics);
            autocomplete(sel("#skil"), Object.keys(topics));
        })
}

gettopic();
title.addEventListener("click", () => {
    console.log("click");
    tarr.push(title.value);
    console.log(tarr);
    db.collection('topics').add({
        title: title.value,
        id: notopic
    }).then(() => {
        notopic = 100;
        topics = {};
        gettopic();

    })
})