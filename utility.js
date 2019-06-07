function sel(data){
return document.querySelector(data);
}

function selAll(data){
    return Array.from(document.querySelectorAll(data));
}

function create(el,options){
var els=document.createElement(el);
Object.keys(options).forEach((data)=>{
    els[data]=options[data];
})
return els;
}

module.exports={sel,selAll,create};