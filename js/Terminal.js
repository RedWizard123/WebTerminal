function Terminal(userName,PCName,rootFolder){
    this.userName=userName;
    this.PCName=PCName;
    this.cmdArray=[];
    this.cmdRecord=[];
    var CurrentPath="/";
    var CurrentFolder=rootFolder;
    var num=0;
    function deleteRight(str){
        while(str.charAt(str.length-1)=="/"){
            str=str.substring(0,str.length-2);
        }
        while(str.indexOf("//")!=-1){
            str=str.replace("//","/");
        }
        return(str);
    }
    function trim(str){
        return str.replace(/(^\s+)|(\s+$)/g, "");
    }
    function deleteSpace(str){
        while(str.indexOf("\s\s")!=-1){
            str=str.replace("\s\s","\s");
        }
        return(str);
    }
    function toAbsolutePath(relativePath){
        if(relativePath.charAt(0)=="/"){
            return(relativePath);
        }
        var tempCurrentPath=CurrentPath;
        relativePath=deleteRight(trim(relativePath));
        if(relativePath.indexOf("/")==-1){
            // no "/"
            if(relativePath==".."){
                if(tempCurrentPath!="/"){
                    tempCurrentPath=tempCurrentPath.substring(0,tempCurrentPath.lastIndexOf("/"));
                    if(tempCurrentPath=="")tempCurrentPath="/";
                    return(tempCurrentPath);
                }else{
                    tempCurrentPath="/";
                    return(tempCurrentPath);
                }
            }else if(relativePath=="."){
                return(tempCurrentPath);
            }else{
                if(tempCurrentPath!="/"){
                    tempCurrentPath+=("/"+relativePath);
                    return(tempCurrentPath);
                }else{
                    tempCurrentPath+=relativePath;
                    return(tempCurrentPath);
                }
            }
        }else{
            var array=relativePath.split("/");
            for(var i=0;i<array.length;i++){
                if(array[i]==".."){
                    if(tempCurrentPath!="/"){
                        tempCurrentPath=tempCurrentPath.substring(0,tempCurrentPath.lastIndexOf("/"));
                        if(tempCurrentPath=="")tempCurrentPath="/";
                    }else{
                        tempCurrentPath="/";
                    }
                }else if(array[i]=="."){

                }else{
                    if(tempCurrentPath!="/"){
                        tempCurrentPath+=("/"+array[i]);
                    }else{
                        tempCurrentPath+=array[i];
                    }
                }
            }
            return(tempCurrentPath);
        }

    }
    function getFolderByPath(absolutePath){
        var tempCurrentFolder=rootFolder;
        if(absolutePath=="/"){
            return({object:tempCurrentFolder,errorType:-1});
        }else{
            absolutePath="#ROOT#"+absolutePath;
            var name=absolutePath.split("/");
            for(var i=1;i<name.length;i++){

                if(tempCurrentFolder.hasOwnProperty(name[i])==true){
                    /*if(typeof tempCurrentFolder[name[i]]=="object"){
                        */tempCurrentFolder=tempCurrentFolder[name[i]];/*
                    }else{
                        return({object:name[i],errorType:1});
                    }*/
                }else{
                    return({object:name[i],errorType:0});
                }
            }
            return({object:tempCurrentFolder,errorType:-1});
        }
    }
    /*
    function getFolderByPathX(absolutePath){
        var tempCurrentFolder=rootFolder;
        if(absolutePath=="/"){
            return({object:tempCurrentFolder,errorType:-1});
        }else{
            absolutePath="#ROOT#"+absolutePath;
            var name=absolutePath.split("/");
            var x;
            var ar=[];
            for(var i=1;i<name.length;i++){
                ar=[];
                for(x in tempCurrentFolder){
                    if(tempCurrentFolder.hasOwnProperty(x)==true){
                        if(toRegExp(name[i]).test(x)==true){
                            tempCurrentFolder=tempCurrentFolder[x];
                            ar.push(tempCurrentFolder);
                            alert(ar.toSource());
                        }
                    }
                }
            }
            if(ar.length==0){
                return({object:name[i],errorType:0});
            }else{
                return({object:ar,errorType:-1});
            }
        }
    }

    function toRegExp(str){
        //only support * ?
        str="^"+str+"$";
        str= str.replace("?",".+");
        str= str.replace("*",".*?");
        alert(str);
        return(new RegExp(str));
    }*/
    /*
     [{a:{}, b:{'321.txt':"", hzy:{}, Terminal:{a:{}, b:{}, c:{d:{'a.txt':"hzylovelyl"}}}}, '123.txt':"ergrtynumyunjm"}]
    */
    //cd, ls, mkdir, cp, mv, touch, cat, rm, 追加内容到文件
    function cd(path){
        var s;
        if(path.charAt(0)=="/"){
            s=path;
        }else{
            s=toAbsolutePath(path);
        }


        var o=getFolderByPath(s);

        if(o.errorType==-1){//success
            if(typeof o.object=="object"){
                CurrentFolder=o.object;
                CurrentPath=s;
                return({result:1,str:""});
            }else{
                return({result:0,str:("Error: Not a folder!").fontcolor("red")});
            }

        }else if(o.errorType==0){
            return({result:0,str:("Error: \""+o.object+"\" not exists!").fontcolor("red")});
        }else if(o.errorType==1){
            return({result:0,str:("Error: \""+o.object+"\" is not a folder!").fontcolor("red")});
        }else{
            return({result:0,str:("Error: Unknown error!").fontcolor("red")});
        }
    }
    function ls(absolutePath){
        var o=getFolderByPath(absolutePath);
        if(o.errorType==-1){
            var tempCurrentFolder=o.object;

            if(typeof tempCurrentFolder!="object"){
                return({result:-1,str:"This is not a folder!"});
            }
            if(tempCurrentFolder=={}){
                return({result:-1,str:"This is an empty folder!"});
            }
            var x;
            var s=[];
            //#729fcf
            for(x in tempCurrentFolder){
                if(tempCurrentFolder.hasOwnProperty(x)){
                    if(typeof tempCurrentFolder[x]=="object"){
                        s.push(x.fontcolor("#729FCF"));
                    }else{
                        s.push(x);
                    }
                }
            }
            var str="";
            for(var i=0;i<s.length;i++){
                str+=s[i]+" ";
            }
            return({result:1,str:str});
        }else{
            return({result:-1,str:"This is not a folder!"});
        }
    }
    function mkdir(name){
        /*if(CurrentFolder.hasOwnProperty(name)==false){
            var cmd="rootFolder";
            var s="#ROOT#"+CurrentPath;
            var array=s.split("/");
            for(var i=1;i<array.length;i++){
                cmd+="[\""+array[i]+"\"]";
            }
            cmd+="[\""+name+"\"]";
            eval(cmd+"={};");
            return(true);
        }else{
            return(false);
        }*/
        if(name==".."){
            return(-1);
        }
        name=trim(deleteRight(name));
        name=toAbsolutePath(name);
        var cmd="rootFolder";
        var s="#ROOT#"+name;
        var array=s.split("/");
        for(var i=1;i<array.length;i++){
            if(i==array.length){
                if(eval("typeof("+cmd+");")=="undefined"){
                    alert("typeof("+cmd+");");
                    return(0);
                }
            }
            cmd+="[\""+array[i]+"\"]";
        }
        //cmd+="[\""+name+"\"]";
        if(eval("typeof("+cmd+");")=="undefined"){
            eval(cmd+"={};");
            return(1);
        }else{
            return(-1);
        }



    }
    function cp(files,dir){
        var obj=getFolderByPath(files);
        var temp;
        if(obj.errorType==-1){
            /*if(typeof(obj.object)=="object"){
                temp=obj.object;
            }else{
                temp=obj.object;
            }*/
            temp=obj.object;
            obj=getFolderByPath(dir);
            if(obj.errorType==-1 && typeof(obj.object)=="object"){
                var cmd="rootFolder";
                var s="#ROOT#"+dir;
                var array=s.split("/");
                for(var i=1;i<array.length;i++){
                    cmd+="[\""+array[i]+"\"]";
                }
                cmd=cmd+"[\""+files.substring(files.lastIndexOf("/")+1,files.length)+"\"]";
                cmd+="=temp;";
                eval(cmd);
                return(true);
            }else{
                return(false);
            }
        }else{
            return(false);
        }
    }
    function mv(files,dir){
        var obj=getFolderByPath(files);
        var temp;
        if(obj.errorType==-1){
            if(typeof(obj.object)=="object"){
                temp=obj.object;
            }else{
                temp=obj.object;
            }
            var cmd="rootFolder";
            var s="#ROOT#"+files;
            var array=s.split("/");
            for(var i=1;i<array.length;i++){
                cmd+="[\""+array[i]+"\"]";
            }
            cmd="delete("+cmd+");";
            eval(cmd);
            obj=getFolderByPath(dir);
            if(obj.errorType==-1 && typeof(obj.object)=="object"){
                cmd="rootFolder";
                s="#ROOT#"+dir;
                array=s.split("/");
                for(i=1;i<array.length;i++){
                    cmd+="[\""+array[i]+"\"]";
                }
                cmd=cmd+"[\""+files.substring(files.lastIndexOf("/")+1,files.length)+"\"]";
                cmd+="=temp;";
                eval(cmd);
                return(true);
            }else{
                return(false);
            }
        }else{
            return(false);
        }
    }
    function touch(name){
        /*var a={a:"",b:""};
        a.c={};*/
        if(name==".."){
            return(-1);
        }
        name=trim(deleteRight(name));
        name=toAbsolutePath(name);
        //var obj=getFolderByPath(name);
        var cmd="rootFolder";
        var s="#ROOT#"+name;
        var array=s.split("/");
        for(var i=1;i<array.length;i++){
            if(i==array.length){
                if(eval("typeof("+cmd+");")=="undefined"){
                    alert("typeof("+cmd+");");
                    return(0);
                }
            }
            cmd+="[\""+array[i]+"\"]";
        }
        //cmd+="[\""+name+"\"]";

        if(eval("typeof("+cmd+");")=="undefined"){
            eval(cmd+"=\"\";");
            return(1);
        }else{
            return(-1);
        }

    }
    function rm(name){
        if(name==".."){
            return(-1);
        }
        name=trim(deleteRight(name));
        name=toAbsolutePath(name);
        var obj=getFolderByPath(name);
        if(obj.errorType==-1){
            var cmd="rootFolder";
            var s="#ROOT#"+name;
            var array=s.split("/");
            for(var i=1;i<array.length;i++){
                cmd+="[\""+array[i]+"\"]";
            }
            cmd="delete("+cmd+");";
            eval(cmd);
            return(1);
        }else{
            return(0);
        }
    }
    function cat(args){
        var cat_rewrite=/^>.+<<$/;
        var cat_add=/^>>.+<<$/;
        var cat_rewriteF2F=/^.+>.+$/;
        var cat_addF2F=/^.+>>.+$/;
        var temp;var obj;var cmd;var s;var i;var array;
        if(cat_rewrite.test(args)){
            //cat >a.txt<<EOF

        }else if(cat_add.test(args)){
            //cat >>a.txt<<EOF

        }else if(cat_addF2F.test(args)){
            //cat a.txt>>b.txt

            args=args.split(">>");
            //alert(args[0]+" "+args[1]);
            temp=getFolderByPath(toAbsolutePath(args[0]));
            if(temp.errorType!=-1){
                return(false);
            }
            alert(temp.toSource());
            obj=getFolderByPath(toAbsolutePath(args[1]));
            if(obj.errorType==-1){
                cmd="rootFolder";
                s="#ROOT#"+toAbsolutePath(args[1]);
                array=s.split("/");
                for(i=1;i<array.length;i++){
                    cmd+="[\""+array[i]+"\"]";
                }
                cmd+="+=temp.object;";
                eval(cmd);
                return(true);
            }else{
                return(false);
            }
        }else if(cat_rewriteF2F.test(args)){
            //cat a.txt>b.txt
            args=args.split(">");
            //alert(args[0]+" "+args[1]);
            temp=getFolderByPath(toAbsolutePath(args[0]));
            if(temp.errorType!=-1){
                return(false);
            }
            alert(temp.toSource());
            obj=getFolderByPath(toAbsolutePath(args[1]));
            if(obj.errorType==-1){
                cmd="rootFolder";
                s="#ROOT#"+toAbsolutePath(args[1]);
                array=s.split("/");
                for(i=1;i<array.length;i++){
                    cmd+="[\""+array[i]+"\"]";
                }
                cmd+="=temp.object;";
                eval(cmd);
                return(true);
            }else{
                return(false);
            }

        }else{
            var name=args;
            name=trim(deleteRight(name));
            name=toAbsolutePath(name);
            obj=getFolderByPath(name);
            if(obj.errorType==-1){
                //alert(typeof(obj.object));
                if(typeof(obj.object)=="string"){
                    return(obj.object);
                }else{
                    return(("\""+obj.args+"\" is a folder!").fontcolor("red"));
                }
            }else{
                return(("\""+obj.args+"\" is invalid!").fontcolor("red"));
            }
        }



    }
    function echo(args){
        var echo_add2F=/^".*?">>.+$/;
        var echo_rewrite2F=/^".*?">.+$/;
        var obj;var cmd;var s;var array;var i;
        if(echo_add2F.test(args)){
            args=args.split(">>");
            var value=args[0].substring(1,args[0].length-1);
            obj=getFolderByPath(toAbsolutePath(args[1]));
            if(obj.errorType==-1){
                cmd="rootFolder";
                s="#ROOT#"+toAbsolutePath(args[1]);
                array=s.split("/");
                for(i=1;i<array.length;i++){
                    cmd+="[\""+array[i]+"\"]";
                }
                cmd+="+=value;";
                eval(cmd);
                return(true);
            }else{
                return(false);
            }
        }else if(echo_rewrite2F.test(args)){
            args=args.split(">");
            var value=args[0].substring(1,args[0].length-1);
            obj=getFolderByPath(toAbsolutePath(args[1]));
            if(obj.errorType==-1){
                cmd="rootFolder";
                s="#ROOT#"+toAbsolutePath(args[1]);
                array=s.split("/");
                for(i=1;i<array.length;i++){
                    cmd+="[\""+array[i]+"\"]";
                }
                cmd+="=value;";
                eval(cmd);
                return(true);
            }else{
                return(false);
            }
        }
    }
    this.getOutput=function(){
        return(this.cmdArray.pop());
    };
    this.getLastCmd=function(){
        if(num>0){
            num--;
        }else{
            num=0;
        }
        return(this.cmdRecord[num]);
    };
    this.getNextCmd=function(){
        if(num<this.cmdRecord.length-1){
            num++;
        }else{
            num=this.cmdRecord.length-1;
        }
        return(this.cmdRecord[num]);
    };
    this.doCmd=function(obj){
        if(obj=={}){
            return({});
        }else{
            if(obj.cmd=="cd"){
                obj.result=cd(obj.args);

                if(obj.result.result==1){//成功的话就没必要显示那么多了
                    obj.cmd="";
                    obj.args="";
                    obj.result.str="";
                }
            }else if(obj.cmd=="ls"){
                obj.result=ls(CurrentPath);
            }else if(obj.cmd=="mkdir"){
                var e=mkdir(obj.args);
                if(e==1){
                    obj.result={result:1,str:""};
                }else if(e==0){
                    obj.result={result:0,str:(" \""+obj.args+"\" invalid!").fontcolor("red")};
                }else if(e==-1){
                    obj.result={result:0,str:("Error:This folder already exits!").fontcolor("red")};
                }
            }else if(obj.cmd=="cp"){
                if(cp(toAbsolutePath(obj.args[0]),toAbsolutePath(obj.args[1]))){
                    obj.result={result:1,str:""};
                }else{
                    obj.result={result:0,str:"Error:No such files"};
                }

            }else if(obj.cmd=="mv"){
                if(mv(toAbsolutePath(obj.args[0]),toAbsolutePath(obj.args[1]))){
                    obj.result={result:1,str:""};
                }else{
                    obj.result={result:0,str:"Error:No such files"};
                }

            }else if(obj.cmd=="touch"){
                var e=touch(obj.args);
                if(e==1){
                    obj.result={result:1,str:""};
                }else if(e==0){
                    obj.result={result:0,str:(" \""+obj.args+"\" invalid!").fontcolor("red")};
                }else if(e==-1){
                    obj.result={result:0,str:("Error:This file already exits!").fontcolor("red")};
                }
            }else if(obj.cmd=="rm"){
                var e=rm(obj.args);
                if(e==1){
                    obj.result={result:1,str:""};
                }else if(e==0){
                    obj.result={result:0,str:("\""+obj.args+"\" is invalid!").fontcolor("red")};
                }
            }else if(obj.cmd=="cat"){
                var e=cat(obj.args);
                if(e==true){
                    e="";
                }else if(e==false){
                    e="Error:Failed!";
                }
                obj.result={result:1,str:e};
            }else if(obj.cmd=="echo"){
                var e=echo(obj.args);
                if(e==true){
                    e="";
                }else if(e==false){
                    e="Error:Failed!";
                }
                obj.result={result:1,str:e};
            }

            this.cmdArray.unshift({un:this.userName,pcn:this.PCName,currentPath:CurrentPath,cmd:obj});
            //this.cmdRecord.push(obj);
        }
    };
    this.Input=function(commandLines){
        commandLines=deleteSpace(trim(commandLines));
        num++;
        this.cmdRecord.push(commandLines);
        var cd_exp=/^cd[ ]+.+/;
        var rm_exp=/^rm[ ]+.+/;
        var cat_exp=/^cat[ ]+.+/;
        var echo_exp=/^echo[ ]+.+/;
        var mkdir_exp=/^mkdir[ ]+.+/;
        var touch_exp=/^touch[ ]+.+/;
        var cp_exp=/^cp[ ]+.+[ ]+.+$/;
        var mv_exp=/^mv[ ]+.+[ ]+.+$/;

        var args;
        if(cd_exp.test(commandLines)==true){
            //cd command line
            args= commandLines.substr(3);
            this.doCmd({cmd:"cd",args:args});
            return(true);
        }else if(commandLines=="ls"){
            this.doCmd({cmd:"ls",args:""});
            return(true);
        }else if(mkdir_exp.test(commandLines)==true){
            args= commandLines.substr(6);
            this.doCmd({cmd:"mkdir",args:args});
            return(true);
        }else if(cp_exp.test(commandLines)==true){
            args= commandLines.substr(3);
            args=args.split(" ");
            this.doCmd({cmd:"cp",args:args});
            return(true);
        }else if(mv_exp.test(commandLines)==true){
            args= commandLines.substr(3);
            args=args.split(" ");
            this.doCmd({cmd:"mv",args:args});
            return(true);
        }else if(touch_exp.test(commandLines)==true){
            args= commandLines.substr(6);
            this.doCmd({cmd:"touch",args:args});
            return(true);
        }else if(rm_exp.test(commandLines)==true){
            args= commandLines.substr(3);
            this.doCmd({cmd:"rm",args:args});
            return(true);
        }else if(cat_exp.test(commandLines)==true){
            args= commandLines.substr(4);
            this.doCmd({cmd:"cat",args:args});
            return(true);
        }else if(echo_exp.test(commandLines)==true){
            args= commandLines.substr(5);
            this.doCmd({cmd:"echo",args:args});
            return(true);
        }
        return(false);
    };
    this.getRootFolder=function(){
        return(rootFolder);
    };
    this.getCurrentTips=function(operation){
        //no: ls cp cat

        if(operation=="cd" || operation=="mkdir"|| operation==""|| operation=="cd"){
            var o=getFolderByPath(toAbsolutePath(CurrentPath));
            if(o.errorType==-1){
                var tempCurrentFolder=o.object;
                var x;
                var s=[];
                for(x in tempCurrentFolder){
                    if(tempCurrentFolder.hasOwnProperty(x)){
                        if(typeof tempCurrentFolder[x]=="object")s.push(x);
                    }
                }
                return(s);
            }
        }else if(operation=="mv"|| operation=="touch"|| operation=="rm"|| operation=="echo"){
            var o=getFolderByPath(toAbsolutePath(CurrentPath));
            if(o.errorType==-1){
                var tempCurrentFolder=o.object;
                var x;
                var s=[];
                for(x in tempCurrentFolder){
                    if(tempCurrentFolder.hasOwnProperty(x)){
                        s.push(x);
                    }
                }
                return(s);
            }
        }





    };
    this.getCurrentPath=function(){
        return(CurrentPath);
    };
}





