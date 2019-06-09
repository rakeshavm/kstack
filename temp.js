var {
    sel,
    selAll,
    create,
    log,
    get
} = require('./utility');
var Handlebars = require('handlebars');
var topics = {};
var tarr = [];
var notopic = 100;
sel("#subm").addEventListener("click", () => {
    var title = document.querySelector("#newtopic").value;
    console.log("click");
    console.log(title);
    tarr.push(title);
    console.log(tarr);
    db.collection('topics').add({
        title: title,
        id: notopic
    }).then(() => {
        notopic = 100;
        topics = {};
        gettopic();

    })
})

var template = (obj) => {
    var src = sel("#entry-tem").innerHTML;
    var temp = Handlebars.compile(src);
    document.body.innerHTML = (temp(obj));
}

template({
    title: "Python",
    content: "tensor"
});