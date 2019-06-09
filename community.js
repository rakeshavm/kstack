firebase = require('firebase');
var {
  sel,
  selAll,
  create,
  log,
  get
} = require('./utility');
var autocomplete = require("./autocomplete.js");
var start = require('./manipulate');

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
var {
  inject,
  setParticipants,
  setGroupname,
  fallback
} = start(sel("#master"), sel("#participants"), sel("#groupname"));


var arr = [];
var x;
var search; // search element

var topic = []; //list o

var topics = {};
var tarr = [];
var notopic = 100;
var gettopic = () => {
  db.collection('topics').get()
    .then((docs) => {
      docs.forEach((doc) => {
        topics[doc.data().title] = doc.data().id;
        notopic += 1;
      })
      // console.log(topics);
      tarr = Object.keys(topics);
      // console.log(notopic);

      // autocomplete(sel("#skills"), Object.keys(topics));
    })
}

gettopic();


sel("#subm").addEventListener("click", () => {

  var skil = [];
  var title = document.querySelector("#newtopic").value;
  console.log("click");
  console.log(title);
  tarr.push(title);


  var idyo;
  db.collection("topics").where("title", "==", title).get().then(docs => {
      docs.forEach(doc => {
        idyo = doc.data().id;
      })
      return idyo;
    })
    .then(id => {
      db.collection('users').where("uid", "==", firebase.auth().currentUser.uid).get().then(data => {
        data.forEach(doc => {
          db.collection("users").doc(doc.id).update({
            skills: firebase.firestore.FieldValue.arrayUnion(id)
          }).then(() => {
            console.log("joined");
          });
        })
      })
    })




  db.collection('topics').add({
    title: title,
    id: notopic
  }).then(() => {
    notopic = 100;
    topics = {};
    gettopic();
  })
})
get(db, "topics").then(da => {
  da.forEach(data => {
    topic.push(data);
  })
}).then(() => {
  var titles = topic.map(data => data.title)
  console.log(titles);
  autocomplete(sel("#skills"), titles);

  sel("#enter").addEventListener('click', () => {
    search = sel("#skills").value;
    if ((titles.includes(search))) {
      x = topic.filter((x) => x.title == search)[0].id;
      console.log(x);
      setGroupname(search);
      brain();
    }
  });




  sel("#groupsubmit").addEventListener('click', () => {
    db.collection("treasury").add({
      content: sel("#content").value,
      flag: false,
      time: +new Date(),
      topicid: topic.filter(data => data.title == search)[0].id,
      userid: firebase.auth().currentUser.uid
    }).then(() => console.log("added new tpic to fires as new skill"))
  });

  sel("#tgsubmit").addEventListener("click", () => {
    db.collection("treasury").add({
      content: sel("#content").value,
      flag: true,
      time: +new Date(),
      topicid: topic.filter(data => data.title == search)[0].id,
      userid: firebase.auth().currentUser.uid
    }).then(() => console.log("added new tpic to fires as new skill"))
  });

  // arr stores values of all chats of that particular topic
});


function brain() {
  db.collection("treasury").where("topicid", "==", x)
    .onSnapshot(function (snapshot) {
      if (snapshot.docs.length != 0) {
        var content, time, userid, name, i = 0;
        var limit = snapshot.docChanges().length;
        console.log(limit, "papa");
        snapshot.docChanges().forEach(function (change) {
          if (change.type === "added") {
            i += 1;
            var data = change.doc.data();
            console.log(data);
            content = data.content;
            time = new Date(data.time).toLocaleTimeString();
            userid = data.userid;
            console.log(userid);
            (function (userid, content, time) {
              get(db, "users", "uid", "==", userid).then((da) => {
                console.log(da);
                name = da[0].name;
                isuser = (da[0].uid == firebase.auth().currentUser.uid) ? true : false;
                console.log(userid);
                arr.push({
                  content,
                  time,
                  name,
                  userid,
                  isuser
                });
                console.log(arr, "mosfjndfj");

                if (i == limit) {
                  console.log("---------------");
                  console.log(arr)
                  var len = [...new Set(arr.map(data => data.userid))].length;
                  setParticipants(len);
                  inject(arr);
                  sel("#master").scrollTop = sel("#master").scrollHeight;
                }
              })

            })(userid, content, time);

          }

        })
      } else {
        fallback();
      }

    })
}