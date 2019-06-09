var autocomplete = require("./autocomplete.js");
firebase = require('firebase');
var {
    sel,
    selAll,
    create,
    get,getImage
} = require("./utility.js");
var flag = false;
var Handlebars=require("handlebars");
var firebaseConfig = {
    apiKey: "AIzaSyDnbW82o5P_oiUEzC1sEfiBPa4nfYZUY4s",
    authDomain: "kstack-a5ac5.firebaseapp.com",
    databaseURL: "https://kstack-a5ac5.firebaseio.com",
    projectId: "kstack-a5ac5",
    storageBucket: "kstack-a5ac5.appspot.com",
    messagingSenderId: "875471920855",
    appId: "1:875471920855:web:84c621dc7b94f249"
};
var newImg='<img src={{url}} height="50px" width="50px" style="float: left;border-radius: 50%" alt="">';

var img=Handlebars.compile(newImg);

var mainT=Handlebars.compile(sel("#entry-tem").innerHTML);

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
var topics = {};
var sub = document.querySelector("#subm");
var help = document.querySelector("#submithelp");
var reqdiv = document.querySelector("#reqdiv");
var img = document.createElement("img");
img.src = "./lg.searching-for-loading-icon.gif";
img.setAttribute("height", "60px");
img.setAttribute("weight", "60px");

var gettopic = () => {
    db.collection('topics').get()
        .then((docs) => {
            docs.forEach((doc) => {
                topics[doc.data().title] = doc.data().id;
                // notopic += 1;
            })
            // console.log(topics);
            // tarr = Object.keys(topics);
            // console.log(notopic);

            autocomplete(sel("#skil"), Object.keys(topics));
        })
}

gettopic();


help.addEventListener("click", () => {
    reqdiv.insertBefore(img, reqdiv.firstChild);
})


var skills = [];

get(db, "users", "uid", "==", firebase.auth().currentUser.uid).then(data => {
    skills = data[0].skills;
    return skills;
}).then((skills) => {
    skills.forEach(data => {
        db.collection("videos").where("id", "==", data).onSnapshot(snapshot => {
            if (snapshot.docs.length != 0) {
                snapshot.docChanges().forEach(function (change) {

                    if (change.type === "modify" || change.type === "added") {
                        var data = change.doc.data();
                        var topicid=data.id;
                        if(change.type=="modify"){
                            sel(`parent${topicid}`).remove();
                        }
                        if (data.userid[0]) {

                            getImage(db,data.userid[0]).then((d)=>{
                                var crd=mainT({title:search,content:data,url:d,topicid});
                                sel("#unknown").innerHTML+=crd;
                            });
                            if(data.userid.length>1){
                                getImage(db,data.userid[1]).then((d)=>{
                                    var imgs=img({url:d});
                                    sel(`#imgt${topicid}`).innerHTML+=imgs;
                                    return 2;
                                }).then((nexts)=>{
                                    if(data.userid.length>1){
                                        getImage(db,data.userid[nexts]).then((d)=>{
                                            var imgs=img({url:d});
                                            sel(`#imgt${topicid}`).innerHTML+=imgs;
                                        });
                                    }
                                 
                                });

                            }

                        }
                    }
                })
            }
        })
    });


    let results = [];
    db.collection("videos").get().then(docs => {
            docs.forEach(doc => {
                results.push(doc.data().id);
            });
            return results;
        })
        .then(results => {
            var arr = results.filter(function (item) {
                return !(~(skills.indexOf(item.id)));
            });
            return arr;
        })
        .then(arr => {
            arr.forEach((ele) => {
                db.collection("videos").where("id", "==", ele).onSnapshot(
                    snapshot => {
                        if (snapshot.docs.length != 0) {
                            snapshot.docChanges().forEach(function (change) {
            
                                if (change.type === "modify" || change.type === "added") {
                                    var data = change.doc.data();
                                    var topicid=data.id;
                                    if(change.type=="modify"){
                                        sel(`parent${topicid}`).remove();
                                    }
                                    if (data.userid[0]) {
            
                                        getImage(db,data.userid[0]).then((d)=>{
                                            var crd=mainT({title:search,content:data,url:d,topicid});
                                            sel("#unknown").innerHTML+=crd;
                                        });
                                        if(data.userid.length>1){
                                            getImage(db,data.userid[1]).then((d)=>{
                                                var imgs=img({url:d});
                                                sel(`#imgl${topicid}`).innerHTML+=imgs;
                                                return 2;
                                            }).then((nexts)=>{
                                                if(data.userid.length>1){
                                                    getImage(db,data.userid[nexts]).then((d)=>{
                                                        var imgs=img({url:d});
                                                        sel(`#imgl${topicid}`).innerHTML+=imgs;
                                                    });
                                                }
                                             
                                            });
            
                                        }
            
                                    }
                                }
                            })
                        }
                    })
            })
        })
})

var search;
var subtopic;
sel("#temp").addEventListener("click", () => {
    search = sel("#input-tag").value;
      subtopic     =  sel("#subtopic").value;
    db.collection("videos").where("name", "==", search).get().then(docs => {
        docs.forEach(doc => {
            data = doc.data();
            if (data.userid.length < 3) {
                let v;
                if (data.userid[0] === "") v = {
                    userid: [firebase.auth().currentUser.uid],
                    content:subtopic
                }
                else {
                    v = {
                        userid: data.userid.concat([firebase.auth().currentUser.uid]),
                        content:subtopic
                    }
                }
                db.collection("videos").doc(doc.id).set(v, {
                    merge: true
                }).then(() => {
                    getImage(db,firebase.auth().currentUser.uid).then((d)=>{
                        var crd=mainT({title:search,content:data,url:d});
                        sel("#unknown").innerHTML+=crd;
                    });
                });
            }
        })
    })

});

//listener for known 

sel("#known").addEventListener("click",(e)=>{
if(e.target.id=="teach"){

}
});
//listener for unknown 


sel("#unknown").addEventListener("click",(e)=>{
if(e.target.id=="learn"){
    if(e.target.parentElement.children>5){
        alert("Users full for session");
        return ;
    }
    var skill=e.target.parentElement.parentElement.firstElementChild.innerHTML;
    get(db,"videos","name","==",skill).then((data)=>{
        data[0].userid
    })
}
});