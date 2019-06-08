var {
    sel,
    selAll,
    create,
    log,
    get
} = require('./utility');
firebase = require('firebase');

var Handlebars = require('handlebars');


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

var container = sel(".tcontainer");

log(firebase);

var db = firebase.firestore();

log(db);
var template = (obj, n) => {
    var src = sel("#entry-template").innerHTML;
    var temp = Handlebars.compile(src);

    if (n === 3) {
        console.log("333333");
        sel(".tcontainer").innerHTML = "";
    }
    else {
        if (n === 2) sel(".tcontainer").innerHTML = "";
        sel(".tcontainer").innerHTML += convert(temp(obj));
        // console.log(temp(obj))

    }

}
var convert = (text) => {
    var exp = /((\b(https?|ftp|file):\/\/|(www\.))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var text1 = text.replace(exp, "<a href='$1'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    text1.replace(exp2, `$1<a target="_blank" href="http://$2">$2</a>`);
    return text1;
}

var addDropdownEle = (obj) => {
    var src = sel("#entry-template-droplist").innerHTML;
    var temp = Handlebars.compile(src);
    sel(".dropdown-menu").innerHTML += temp(obj)
}

var getTopicsCard = () => {
    // var user = firebase.auth().currentUser;
    let name = "";
    db.collection("users").doc("LZHB76lgAO1NsaUpGZgN").get().then((doc) => {
            // log(doc.data().skills);
            name = doc.data().name;
            return doc.data().skills;
        })
        .then(skills => {
            log(skills);
            // result = [];
            skills.forEach(skill => {
                // log("shit:",skill);

                db.collection("treasury").where("topicid", "==", skill).orderBy("time", "desc").get()
                    .then(docs => {
                        // log(docs);
                        docs.forEach((doc, i) => {
                            let tcontent = doc.data();
                            db.collection("topics").where("id", "==", skill).get().then((docs) => {
                                docs.forEach(doc => {
                                    log(doc.data().title);
                                    tcontent.title = doc.data().title;
                                    // tcontent.name = name;
                                    // log(tcontent);
                                    // tcontent.content = convert(tcontent.content);
                                    log(tcontent);
                                    template(tcontent, 1);
                                })
                            }).catch(() => {
                                template({}, 3);
                            })

                            // result.push(tcontent);
                        })


                        // log(result);
                    }).catch(err => log(err))
            })
        });
}



var getTopics = () => {
    let result = [];
    get(db, "topics")
        .then((topics) => {
            topics.forEach(topic => {
                result.push({
                    title: topic.title
                });
            })
            console.log(result);
            result.forEach(res => {
                addDropdownEle(res);

            })

            let a = document.querySelectorAll(".target");
            a.forEach((ele) => {
                ele.addEventListener("click", (event) => {
                    console.log(event.target.innerHTML);
                    db.collection("topics").where("title", "==", event.target.innerHTML).get().then((x) => {
                        console.log(x);
                        x.forEach((doc) => {
                            console.log(doc.data().id);
                            db.collection("treasury").where("topicid", "==", doc.data().id).where("flag", "==", true).get()
                                .then(docs => {
                                    if(docs.docs.length === 0)template(item,3);
                                    docs.forEach(doc => {
                                        console.log(doc.data());
                                        let item = doc.data();
                                        item.title = event.target.innerHTML;
                                        console.log(item);
                                        template(item, 2);

                                    })
                                }).catch(() => {
                                    console.log("hmmmmm");
                                    template({}, 3);
                                })

                        })
                    })
                })
            })

        })

}


getTopicsCard();

getTopics();