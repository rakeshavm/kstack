var Handlebars = require('handlebars');

var template = "<div class='fa clearfix'><div class='speech-bubble-{{dir}}' style='float:{{dir}}'><p style='color:#5dd4a8;padding:6px'>{{user}}</p><div style='display:flex;'><p style='padding:4px' style='flex:1'>{{message}}</p><p class='text-muted' style='flex:2;font-size:13px;padding-left:6px;padding-top:5px'>{{time}}</p></div></div></div>"


var temp = Handlebars.compile(template);
var parents;
var parents1;
var parents2;

function inject(obj) {
    parents.innerHTML = "";
    obj.forEach(element => {
        var dir = element.isuser ? "right" : "left";
        parents.innerHTML += temp({
            dir,
            message: element.content,
            user: element.name,
            time: element.time
        })
    });
    

}

function init(parent, parent1, parent2) {
    parents = parent;
    parents1 = parent1;
    parents2 = parent2;
    return {
        inject,
        setParticipants,
        setGroupname,
        fallback
    }
}

function setParticipants(no) {
    parents1.innerHTML = `${no} Participants`;
}

function setGroupname(str) {
    parents2.innerHTML = str;
};

function fallback() {
    parents.innerHTML = "No messages conversed yet";
}

module.exports = init;