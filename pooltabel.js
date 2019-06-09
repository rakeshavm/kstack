var autocomplete = require("./autocomplete.js");
firebase = require('firebase');
var chat=require("./chatpooltable.js");
var sami=require("./manipulate");
var axios=require("axios");
var arr=[];
var {
    sel,
    selAll,
    create,
    get,
    getImage
} = require("./utility.js");
var flag = false;
var teachflag = false;
var Handlebars = require("handlebars");
var firebaseConfig = {
    apiKey: "AIzaSyDnbW82o5P_oiUEzC1sEfiBPa4nfYZUY4s",
    authDomain: "kstack-a5ac5.firebaseapp.com",
    databaseURL: "https://kstack-a5ac5.firebaseio.com",
    projectId: "kstack-a5ac5",
    storageBucket: "kstack-a5ac5.appspot.com",
    messagingSenderId: "875471920855",
    appId: "1:875471920855:web:84c621dc7b94f249"
};
var newImg = "<img src='{{url}}' height='50px' width='50px' style='float: left;border-radius: 50%'>";

var mainT = Handlebars.compile(sel("#entry-tem").innerHTML)
var imgo = Handlebars.compile(newImg);

firebase.initializeApp(firebaseConfig);

var search;
var subtopic;

function start() {

    let db = firebase.firestore();
    var topics = {};
    var sub = document.querySelector("#subm");
    var help = document.querySelector("#submitHelp");
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
        console.log("click");
        searching();
    })


    var skills = [];

    get(db, "users", "uid", "==", firebase.auth().currentUser.uid).then(data => {
        skills = data[0].skills;
        return skills;
    }).then((skills) => {
        ;
        skills.forEach(data => {
            db.collection("videos").where("id", "==", data).onSnapshot(snapshot => {
                ;
                if (snapshot.docs.length != 0) {
                    ;
                    snapshot.docChanges().forEach(function (change) {
                        console.log("known changes entered"+change.type);
                        if (change.type === "modify" || change.type === "added") {
                            var data = change.doc.data();
                            var topicid = data.id;

                            if (change.type == "modify") {
                                sel(`parent${topicid}`).remove();
                            };

                            if (data.insid) {
                                getImage(db, data.insid).then((d) => {
                                    return d;

                                }).then((tprof) => {
                                    getImage(db, data.userid[0]).then((d) => {
                                        var crd = mainT({
                                            title: data.name,
                                            content: data.content,
                                            // url: d,
                                            topicid,
                                            turl: tprof
                                        });
                                        console.log(crd);
                                        sel("#known").innerHTML += crd;

                                    })

                                }).then(() => {

                                    if (data.userid.length > 1) {
                                        getImage(db, data.userid[1]).then((d) => {

                                            // imgs = imgo({
                                            //     url: d
                                            // });
                                            // sel(`#imgt${topicid}`).innerHTML += imgs;

                                        }).then((nexts) => {

                                            if (data.userid.length > 2) {
                                                getImage(db, data.userid[2]).then((d) => {
                                                    // var imgs = imgo({
                                                    //     url: d
                                                    // });
                                                    // sel(`#imgt${topicid}`).innerHTML += imgs;
                                                });
                                            }

                                        });

                                    }
                                })
                            };;

                            if (data.userid[0]) {

                                getImage(db, data.userid[0]).then((d) => {
                                    if (!teachflag) {
                                        var crd = mainT({
                                            title: data.name,
                                            content: data.content,
                                            url: d,
                                            topicid
                                        });
                                        console.log("fnkdshksdhg");
                                        console.log(search, data, topicid);
                                        console.log(crd);
                                        sel("#known").innerHTML += crd;
                                    }
                                    if (data.userid.length > 1) {
                                        getImage(db, data.userid[1]).then((d) => {
                                            var imgs = imgo({
                                                url: d
                                            });
                                            sel(`#imgl${topicid}`).innerHTML += imgs;

                                        }).then((nexts) => {
                                            if (data.userid.length > 2) {
                                                getImage(db, data.userid[2]).then((d) => {
                                                    var imgs = imgo({
                                                        url: d
                                                    });
                                                    sel(`#imgl${topicid}`).innerHTML += imgs;
                                                });
                                            }

                                        });

                                    }
                                });


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
                console.log(results + "heyy")
                return results;
            })
            .then(results => {
                var arr = results.filter(function (item) {
                    console.log(item);
                    return !(~(skills.indexOf(item)));
                });
                console.log(arr + "the skills");

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
                                        var topicid = data.id;

                                        if (change.type == "modify") {
                                            sel(`parent${topicid}`).remove();
                                        };

                                        if (data.insid) {
                                            getImage(db, data.insid).then((d) => {
                                                return d;

                                            }).then((tprof) => {
                                                getImage(db, data.userid[0]).then((d) => {
                                                    var crd = mainT({
                                                        title: data.name,
                                                        content: data.content,
                                                        topicid,
                                                        turl: tprof
                                                    });
                                                    sel("#unknown").innerHTML += crd;

                                                })

                                            }).then(() => {
                                                if (data.userid.length > 1) {
                                                    console.log(data + "lolllll");
                                                    getImage(db, data.userid[1]).then((d) => {
                                                        // var imgs = imgo({
                                                        //     url: d
                                                        // });
                                                        // sel(`#imgl${topicid}`).innerHTML += imgs;

                                                    }).then((nexts) => {
                                                        if (data.userid.length > 2) {
                                                            getImage(db, data.userid[2]).then((d) => {
                                                                // var imgs = imgo({
                                                                //     url: d
                                                                // });
                                                                // sel(`#imgl${topicid}`).innerHTML += imgs;
                                                            });
                                                        }

                                                    });

                                                }
                                            })
                                        };

                                        if (data.userid[0]) {
                                            getImage(db, data.userid[0]).then((d) => {
                                                if (!teachflag) {
                                                    var crd = mainT({
                                                        title: data.name,
                                                        content: data.content,
                                                        url: d,
                                                        topicid
                                                    });
                                                    sel("#unknown").innerHTML += crd;
                                                }
                                                if (data.userid.length > 1) {
                                                    console.log(data);
                                                    getImage(db, data.userid[1]).then((d) => {
                                                        var imgs = imgo({
                                                            url: d
                                                        });
                                                        sel(`#imgl${topicid}`).innerHTML += imgs;

                                                    }).then((nexts) => {
                                                        if (data.userid.length > 2) {
                                                            getImage(db, data.userid[2]).then((d) => {
                                                                var imgs = imgo({
                                                                    url: d
                                                                });
                                                                sel(`#imgl${topicid}`).innerHTML += imgs;
                                                            });
                                                        }

                                                    });

                                                }
                                            });


                                        }
                                    }
                                })
                            }
                        })
                })
            })
    })


    function searching() {
        search = sel("#skil").value;
        subtopic = sel("#subskil").value;

        db.collection("videos").where("name", "==", search).get().then(docs => {
            docs.forEach(doc => {
                data = doc.data();
                if (data.userid.length < 3) {
                    let v;
                    if (data.userid[0] === "") v = {
                        userid: [firebase.auth().currentUser.uid],
                        content: subtopic
                    }
                    else {
                        v = {
                            userid: data.userid.concat([firebase.auth().currentUser.uid]),
                            content: subtopic
                        }
                    }
                    db.collection("videos").doc(doc.id).set(v, {
                        merge: true
                    }).then(() => {
                        getImage(db, firebase.auth().currentUser.uid).then((d) => {
                            var crd = mainT({
                                title: data.name,
                                content: data.content,
                                url: d
                            });
                            sel("#unknown").innerHTML += crd;
                            db.collection("videos").where("id", "==", topics[search]).get().then((qs) => {
                                stateGroup = topics[search];
                                qs.forEach((docs) => {
                                    db.collection("videos").doc(docs.id).onSnapshot((doc) => {
                                        if (doc.data().sessionLive) {
                                        console.log(docs.id);
                                        console.log(doc.data().sessionLive)
                                        $("#demo01").click();
                                        saveme(stateGroup,teachflag,db);
                                        }
                                    })
                                });
                            });
                            
                        });
                    });
                }
            })
        })

    };

    //listener for known 

    sel("#known").addEventListener("click", (e) => {
        if (e.target.id == "teach") {

            teachflag=true;

            var topicid = e.target.parentElement.parentElement.id.split("parent");
            console.log(topicid);
            db.collection("videos").where("id", "==", topicid[1]).get().then((qs) => {
                stateGroup = topicid[1];
                console.log(qs.docs.length);
                qs.forEach((docs) => {
                    console.log("inside");
                    id = firebase.auth().currentUser.uid;
                    console.log(firebase.auth().currentUser.uid);
                    db.collection("videos").doc(docs.id).update({
                        sessionLive: true,
                        insid: id
                    }).then(() => {
                        console.log("hitter");
                        $("#demo01").click();
                        saveme(stateGroup,teachflag,db);
                    })
                })
            })
        }
    });
    //listener for unknown 


    sel("#unknown").addEventListener("click", (e) => {
        console.log("click");
        if (e.target.id == "learn") {
            console.log("hmm");
            if (e.target.previousElementSibling.children > 2) {
                alert("Users full for session");
                return;
            }
            console.log(e.target);
            console.log(e.target.nextElementSibling.nextElementSibling.children.length == 2);
            if (e.target.nextElementSibling.nextElementSibling.children.length == 2) {
                console.log("yoyo");
                var topicid = e.target.parentElement.parentElement.id.split("parent");
                db.collection("videos").where("id", "==", topicid[1]).get().then((qs) => {
                    stateGroup = topicid;
                    let id = firebase.firestore().currentUser.uid;
                    qs.forEach((docs) => {
                        db.collection("videos").doc(docs.id).update({
                            userid: firebase.firestore.FieldValue.arrayUnion(id)
                        }).then(() => {
                        $("#demo01").click()
                        });
                    })
                })
            }
            var topicid = e.target.parentElement.parentElement.id.split("parent");

            db.collection("videos").where("id", "==", topicid[1]).get().then((qs) => {
                stateGroup = topicid;
                qs.forEach((docs) => {
                    db.collection("videos").doc(docs.id).onSnapshot((doc) => {
                        console.log(docs.id);
                        console.log(doc.data().sessionLive)
                        if (doc.data().sessionLive) {
                        $("#demo01").click();
                        saveme(stateGroup,teachflag,db);
                        }
                    })
                });
            });


            db.collection("videos").where("id", "==", topicid[1]).get().then((qs) => {
                var id = firebase.auth().currentUser.uid;
                qs.forEach((docs) => {
                    db.collection("videos").doc(docs.id).update({
                        userid: firebase.firestore.FieldValue.arrayUnion(id)
                    }).then(() => {
                        console.log("Youll be allocated to a session soon");
                    });
                })
            });


        }
    });

}
sel("#lolss").addEventListener("click",()=>{
    $("#demo01").click();
    saveme("101",false,firebase.firestore());
})
sel("#lolss1").addEventListener("click",()=>{
    $("#demo01").click();
    saveme("101",true,firebase.firestore());
})
sel("#lolss2").addEventListener("click",()=>{
    $("#demo01").click();
    saveme("101",true,firebase.firestore());
})

firebase.auth().onAuthStateChanged(function (authdata) {
    if (authdata) {
        start();
    } else {
        console.log("Signed out");
    }
});




var saveme=function(s,t,db){
    var state=s;
    teacher=t;
    
    
    var {
        inject,
        setGroupname,
        fallback
    } = sami(sel("#master"), sel("#participants"), sel("#groupname"));
    
    var toBeSent = [];
    
    setGroupname(state);
    console.log("hit");
    
    brain();
    
    console.log(state);
    sel("#groupsubmit").addEventListener('click', () => {
        toBeSent.push(sel("#content").value);
        db.collection(state).add({
            content: sel("#content").value,
            flag: false,
            time: +new Date(),
            userid: firebase.auth().currentUser.uid
        }).then(() => console.log("added new tpic to fires as new skill"))
    });
    
    sel("#tgsubmit").addEventListener("click", () => {
        toBeSent.push(sel("#content").value);
        var obj = {
            content: sel("#content").value,
            flag: true,
            time: +new Date(),
            topicid: +state,
            userid: firebase.auth().currentUser.uid
        }
        db.collection(state).add(obj).then(() => console.log("added new tpic to fires as new skill"));
        db.collection("treasury").add(obj).then(() => alert("Added to treasury"));
    });
    
    // arr stores values of all chats of that particular topic
    
    
    function brain() {
        db.collection(state).onSnapshot(function (snapshot) {
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
                                    inject(arr);
                                }
                            })
    
                        })(userid, content, time);
    
                    }
    
                })
            } else {
                fallback();
            }
    
        });
    }
    
    sel("#participants").addEventListener("click", function () {
        backup = sel("#master").innerHTML;
        if (teacher) {
            sel("#master").innerHTML = "<iframe style='width:100%;height:100%' src='rtc/index.html'></iframe>";
    
        } else {
            sel("#master").innerHTML = "<iframe style='width:100%;height:100%' src='rtc/index.html?audience=true'></iframe>";
    
        }
    })
    sel("#closeModal").addEventListener("click", () => {
        console.log(toBeSent);
        if (toBeSent) {
            axios.post('10.2.89.160:5000/api', {
                val: toBeSent
            }).then((response) => {
                alert(response);
            }).catch((err) => {
                console.log(err);
            })
        };
        axios.get("http://10.2.89.160:5560").then(alert(response));
    
    });
    alert("done calling")
}


