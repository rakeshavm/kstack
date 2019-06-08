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


function get(db,collection,a,b,c){
    return new Promise((res,rej)=>{
        if(a && b && c){
            let data=[]
            db.collection(collection).where(a,b,c).get().then((qs)=>{
                qs.forEach((d)=>{
                   data.push(d.data());
                });
                res(data);
            }).catch((err)=>rej(err));
        }else{
            let data=[];
            db.collection(collection).get().then((qs)=>{
                qs.forEach((d)=>{
                    data.push(d.data());
                 });
                 res(data);
            }).catch((err)=>rej(err));
        }
      
    });
};

function log(d){
    console.log(d);
}

// get(db,"users","uid","==","kl").then((data)=>data);
// array of documents


module.exports={sel,selAll,create,get,log};