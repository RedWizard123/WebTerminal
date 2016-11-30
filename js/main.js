function q(s){
    return(document.querySelector(s));
}
var json={};
/*var json={
    "bin": {},
    "mnt": {
        "a": {},
        "b": {
            "321.txt":"edryu",
            "hzy":{},
            "Terminal":{
                "a":{},
                "b":{},
                "c":{
                    "d":{
                        "a.txt":"hzylovelyl",
                        "b.txt":"hzylovelyl",
                        "c.txt":"hzylovelyl",
                        "d.txt":"hzylovelyl"
                    }
                }
            }
        },
        "123.txt":"ergrth"
    },
    "home": {
        "c.txt":"erfgrd"
    },
    "boot":{
        "index.html":"ersgrjhgu",
        "main.css":"qwhgdfwyhsfbhuy"
    }

};*/

//
var WebTerminal;
function printToScreen(obj){
    var cloneDiv= q("div#prime").cloneNode(true);
    q("div.container").appendChild(cloneDiv);
    cloneDiv.setAttribute("id","");
    cloneDiv.style.display="block";
    var HTML= cloneDiv.innerHTML;
    HTML=HTML.replace("{{user_name}}",obj.un);
    HTML=HTML.replace("{{pc_name}}",obj.pcn);
    HTML=HTML.replace("{{CurrentPath}}",obj.currentPath);
    if(typeof obj.cmd.args=="string"){
        HTML=HTML.replace("{{input}}",obj.cmd.cmd+" "+obj.cmd.args);
    }else{
        //alert(obj.cmd.args.length);
        HTML=HTML.replace("{{input}}",obj.cmd.cmd+" "+obj.cmd.args[0]+" "+obj.cmd.args[1]);
    }

    HTML=HTML.replace("{{output}}",obj.cmd.result.str);//hongse
    cloneDiv.innerHTML=HTML;
    q("div.container").scrollTo(0,q("div.container").scrollHeight);
}
window.onload=function(){
    json=eval("("+window.localStorage.getItem("rootFolder")+")");
    WebTerminal=new Terminal("unique","HZY-PC",json);

    q("#input-label").innerHTML=WebTerminal.userName+"@"+WebTerminal.PCName+":"+WebTerminal.getCurrentPath();

    if(WebTerminal.Input("cd /mnt/b/Terminal/c"))printToScreen(WebTerminal.getOutput());

    window.onbeforeunload=function(){
        window.localStorage.setItem("rootFolder",WebTerminal.getRootFolder().toSource());
    }
};
function inputkeydown(e) {

    if (e.keyCode == 13) {
        if(WebTerminal.Input(q("#input").value))printToScreen(WebTerminal.getOutput());
        q("#input").value = "";
    }else if(e.keyCode==38){
        q("#input").value=WebTerminal.getLastCmd();
    }else if(e.keyCode==40){
        q("#input").value=WebTerminal.getNextCmd();
    }else if(e.keyCode==9){
        if(q('#input').value!=""){
            //alert(WebTerminal.getCurrentTips("mv"));
            var array=WebTerminal.getCurrentTips("mv");
            var cloneDiv= q("div#tabTips").cloneNode(true);
            q("div.container").appendChild(cloneDiv);
            cloneDiv.setAttribute("id","");
            cloneDiv.style.display="block";
            var HTML="";
            for(var i=0;i<array.length;i++){
                HTML+="<span onclick=\"q('#input').value+=this.innerHTML;\">"+array[i]+"</span>";
                if((i+1)%3==0){
                    HTML+="<br>";
                }
            }
            cloneDiv.innerHTML=HTML;
        }

    }
    q("#input-label").innerHTML=WebTerminal.userName+"@"+WebTerminal.PCName+":"+WebTerminal.getCurrentPath();
}
