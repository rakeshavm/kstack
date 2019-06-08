var Handlebars = require('handlebars');

var template = "<div class='fa clearfix'><div class='speech-bubble-{{dir}}' style='float:{{dir}}'><p style='color:#5dd4a8;padding:6px'>{{user}}</p><div style='display:flex;'><p style='padding:4px' style='flex:1'>{{message}}</p><p class='text-muted' style='flex:2;font-size:13px;padding-left:6px;padding-top:5px'>{{time}}</p></div></div></div>"


var temp = Handlebars.compile(template);

function init(parent) {
    return function (obj) {
        var dir = obj.isuser ? "right" : "left";
        parent.innerHTML += temp({
            dir,
            message: obj.content,
            user: name,
            time: time.toLocaleTimeString()
        })

    }
}

function setParticipants(no, el) {
    el.innerHTML = `${no} Participants`;
}

function setGroupname(str, el) {
    el.innerHTML = str;
}

module.exports = init;