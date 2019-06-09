
var start=require("./manipulate");
var axios = require("axios");
function start(s,t){
    var state=s;
    teacher=t;
    
    
    var {
        inject,
        setGroupname,
        fallback
    } = start(sel("#master"), sel("#participants"), sel("#groupname"));
    
    var toBeSent = [];
    
    setGroupname(state);
    
    
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


module.exports=function(s,te){
    alert("loaded");
    start(s,te);
    alert("done calling")
}