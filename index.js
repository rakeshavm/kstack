var autocomplete = require("./autocomplete.js");
var $=require('jquery');
require('gasparesganga-jquery-loading-overlay');

firebase = require('firebase');
var {
    sel,
    selAll,
    create,get
} = require("./utility.js");
var notopic = 0;
var firebaseConfig = {
    apiKey: "AIzaSyDnbW82o5P_oiUEzC1sEfiBPa4nfYZUY4s",
    authDomain: "kstack-a5ac5.firebaseapp.com",
    databaseURL: "https://kstack-a5ac5.firebaseio.com",
    projectId: "kstack-a5ac5",
    storageBucket: "kstack-a5ac5.appspot.com",
    messagingSenderId: "875471920855",
    appId: "1:875471920855:web:84c621dc7b94f249"
};

var topics = {};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


let auth = firebase.auth();
var signedUp = false;
let db = firebase.firestore();

sel("#signin").addEventListener("click", function () {
    signIn(sel("#username").value, sel("#pwd").value);
});

sel("#signup").addEventListener("click", function () {
    $.LoadingOverlay("show");
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
                        var docs = doc.data();
                        topics[docs.title] = docs.id;
                        console.log(docs.title, docs.data);
                        notopic += 1;
                    });
                    console.log(topics);
                    sel("#master").innerHTML = sel("#temp").innerHTML;
                    $.LoadingOverlay("hide");

                    autocomplete(sel("#skills"),Object.keys(topics));
                    sel("#add").addEventListener("click", () => {
                        skills.push(sel("#skills").value);
                        sel("#skills").value = "";
                        console.log(skills);
                    });
                    sel("#submit").addEventListener("click", () => {
                            console.log("hey");
                            var unknown = skills.filter((d) => !topics[d]);
                            var known = skills.filter((d) => topics[d]);
                            console.log(known, unknown);
                            unknown.forEach((d, i) => {
                                    db.collection("topics").add({
                                        title: d,
                                        id: notopic + i + 1 + 100
                                    }).then(() => {
                                            var merge = known.concat(unknown);
                                            console.log(merge);
                                            db.collection("topics").get().then((d) => {
                                                    var topicsr = [];
                                                    d.forEach((doc) => {
                                                        topicsr.push(doc.data());
                                                    });
                                                    console.log(topicsr);
                                                    var ids=[];
                                                    merge.forEach(d=>{
                                                        ids.push(topicsr.find((x) => d == x.title).id);
                                                    });
                                                    console.log(ids);
                                                    db.collection("users").where("uid", "==", firebase.auth().currentUser.uid).get().then((qs) => {
                                                            qs.forEach((d) => {
                                                                console.log(d.id);
                                                                    db.collection("users").doc(d.id).set({
                                                                            skills: ids
                                                                        }, {
                                                                            merge: true
                                                                        }
                                                                    )
                                                            })
                                                    });
                                            });
                                    });
                            });
                        });
                    }).catch((err) => {
                    console.log(err);
                    signedUp = false;
                });
            });

        auth.onAuthStateChanged(function (authdata) {
            if (authdata && (!signedUp)) {
                window.open("community.html", "_self");
                return;
            } else {
                console.log("Signed out");
            }
        });


        function signIn(email, pass) {
            auth.signInWithEmailAndPassword(email, pass).catch((err) => alert(err));
        }



        var skills = [];