var {
  sel,
  selAll,
  create,
  log,
  get
} = require('./utility');
var autocomplete = require("./autocomplete.js");

firebase = require('firebase');

var firebaseConfig = {
  apiKey: "AIzaSyDnbW82o5P_oiUEzC1sEfiBPa4nfYZUY4s",
  authDomain: "kstack-a5ac5.firebaseapp.com",
  databaseURL: "https://kstack-a5ac5.firebaseio.com",
  projectId: "kstack-a5ac5",
  storageBucket: "kstack-a5ac5.appspot.com",
  messagingSenderId: "875471920855",
  appId: "1:875471920855:web:84c621dc7b94f249"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

var arr = [];
var x;
var search; // search element

var topic = []; //list o

get(db, "topics").then(da => {
  da.forEach(data => {
    topic.push(data)
  })
});

sel("#enter").addEventListener('click', () => {
  search = sel("#search").value;
  if (!(topic.map( (data)=> data.title ).includes(search))) {
    db.collection("topics").add({
      id: topic.length + 1 + 100,
      title: search
    }).then(() => {
      topic.push(search);
    })
  }
});


get(db, "topics", "title", '==', x).then(da => {
  search = da[0].id
}).catch(() => console.log('Not found'));

sel("#groupsubmit").addEventListener('click', () => {
      db.collection("treasury").add({
        content: sel("#content").value,
        flag: false,
        time: firebase.firestore.Timestamp.fromDate(new Date()),
        topicid: ,
        userid: firebase.auth().currentUser.uid
      })

      // arr stores values of all chats of that particular topic


      db.collection("treasury").where("topicid", "==", 101)
        .onSnapshot(function (snapshot) {
          if (snapshot.docs.length != 0) {
            var content, time, userid, name, i = 0;
            var limit = snapshot.docChanges().length;
            snapshot.docChanges().forEach(function (change) {
              if (change.type === "added") {
                i += 1;
                var userDoc = change.doc.data();
                content = data.content;
                time = data.time.toDate();
                userid = data.userid;
                get(db, "users", "uid", "==", userid).then((da) => {
                  name = da[0].name;
                  isuser = (da[0].uid == firebase.auth().currentUser.uid) ? true : false;
                  arr.push({
                    content,
                    time,
                    name,
                    isuser
                  })
                  if (i == limit) {
                    //    artifact(arr)
                  }
                })
              }

            })
          } else {
            // something()
          }

        });