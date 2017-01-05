function hereDoc(f) {
    return f.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '')
}
String.prototype.trim=function()
{
     return this.replace(/(^\s*)|(\s*$)/g,'');
}

function isEmpty(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}



function tpl_replace(str,data){
    var tpl=str
    for(var key in data){
        tpl=tpl.replace('{'+key+'}',data[key])
    }
    return tpl
}


function _PYTHON_REQUEST(){
/*
for i in range(0,1):
    try:
        import requests
        import json
        url='''{url}'''
        header='''{header}'''
        body='''{body}'''
        jscode='''{jscode}'''
        posturl='''{posturl}'''#js server phantomjs
        data={'url':url,'header':header,'body':body,'jscode':jscode,'posturl':posturl}
        jdata=requests.post('http://127.0.0.1:8080/api/request',data).text
        jdata=json.loads(jdata)
        for d in jdata:
            d['site']='KanKanDou'
            d['status']='0'
            d['level']='1'
            print d
            #ci.db.insert('urls',d)
    except Exception as er:
        pass
        #ci.logger.error(er)
*/
}

function obj2string(o) {
    var r = [];
    if (typeof o == "string") {
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\""
    }
    if (typeof o == "object") {
        if (o == null) {
            return 'null'
        }
        if (!o.sort) {
            for (var i in o) {
                r.push(i + ":" + obj2string(o[i]))
            }
            if ( !! document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString())
            }
            r = "{" + r.join() + "}"
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(obj2string(o[i]))
            }
            r = "[" + r.join() + "]"
        }
        return r
    }
    return o.toString()
}


function valid_head(str){
    if(str==undefined){
      return false;
    } else {
        check=function(str,sep) {
            var lines = str.split(/\n/);
            var flag = true;
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line.trim() != '') {
                    var pos = line.indexOf(sep);
                    if (pos == -1) {
                        flag = false;
                        break;
                    }
                }
            }
            return flag
        }
        return check(str,':')||check(str,'=')
    }

}

function build_header(str){
    if(str==undefined||!valid_head(str)){
       return []
    }
    var header=[];
    var lines= str.split(/\n/);
    for(var i=0;i<lines.length;i++){
        var line=lines[i];
        if(line.trim()!=''){
            var pos= line.indexOf(':')>0?line.indexOf(':'):line.indexOf('=');
            if(pos!=-1){
                var key=line.substring(0,pos).trim()
                var value=line.substring(pos+1,line.length).trim()
                header.push({'key':key,'value':value})
            }
        }
    }
    return header;
}

function get_kv(items){
   var kv={}
    for(var i=0;i<items.length;i++){
          var item=items[i];
          kv[item['key']]=item['value'];
    }
    return kv;
}


function build_data(str) {
    var data=[];
    if(str==undefined){
        return data
    }
    var values=str.split('&');
    for(var i=0;i<values.length;i++) {
        var value=values[i];
        var kvs=value.split('=')
        if(kvs.length==2){
            data.push({'key':kvs[0],'value':decodeURIComponent(kvs[1])})
        }
    }
    return data
}
function waitFor(testFx, onReady, onTimeout, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis: 3000,
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
        if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
            condition = (typeof(testFx) === "string" ? eval(testFx) : testFx())
        } else {
            if (!condition) {
                console.log("'waitFor()' timeout");
                typeof(onTimeout) === "string" ? eval(onTimeout) : onTimeout();
                clearInterval(interval)
            } else {
                console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                typeof(onReady) === "string" ? eval(onReady) : onReady();
                clearInterval(interval)
            }
        }
    },
    250)
};
var system = require('system');
var fs = require('fs');
function get_file_content(filename) {
    var content = fs.read(filename);
    return content;
}
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false
    }
    return true
}
var webserver = require('webserver');
var server = webserver.create();
port = 8080
if (system.args.length == 2) {
    port = parseInt(system.args[1])
}
if (!port) {
    port = 8080
}
console.log('server port:' + port);
var service = server.listen(port,
function(request, response) {
    uri = request.url;
    console.log(uri);
    var content = '';
    response.statusCode = 200;

    if (uri == '/api' || uri == '/api/' || uri.indexOf('/api/')!=-1) {
        try {
            var data = {}
            try {
                var data = request.post
                if (typeof(data) === 'string') {
                    try {
                        data = {}
                        var dr = request.post.split('&');
                        //                        console.log(dr.length);
                        for (i = 0; i < dr.length; i++) {
                            var kv = dr[i].split('=');
                            //                            console.log(kv);
                            data[kv[0]] = decodeURIComponent(kv[1].replace(/\+/ig, ' '))
                        }
                    } catch(er) {
                        console.log("data tran", er)
                    }
                }
            } catch(e) {
                console.log('e', e);
                try {
                    var dr = request.post.split('&');
                    console.log(dr.length);
                    for (i = 0; i < dr.length; i++) {
                        var kv = dr[i].split('=');
                        console.log(kv);
                        data[kv[0]] = decodeURIComponent(kv[1].replace(/\+/ig, ' '))
                    }
                } catch(er) {
                    console.log("data tran", er)
                }
            }

            console.log('post_data_all=>',obj2string(data))

            if(uri.indexOf('/api/buildRequest')!=-1){

                var tpl= hereDoc(_PYTHON_REQUEST);
                content=tpl_replace(tpl,data);
                response.write(content);
                response.close();
                return;
            }

            var page = require('webpage').create();
            page.onResourceRequested = function(requestData, networkRequest) {
                console.log(requestData.url)
            };
            if (data['js'] == 0) {
                page.onResourceRequested = function(requestData, request) {
                    if ((/http:\/\/.+?\.css/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'text/css') {
                        request.abort()
                    }
                    if ((/http:\/\/.+?\.js/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'text/javascript') {
                        request.abort()
                    }
                    if ((/http:\/\/.+?\.(jpg|png|gif)/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'image/pjpeg' || requestData.headers['Content-Type'] == 'image/gif' || requestData.headers['Content-Type'] == 'image/png') {
                        request.abort()
                    }
                }
            }
            page.onAlert = function(msg) {
                console.log('ALERT: ' + msg)
            };
            page.onCallback = function(data) {
                console.log('CALLBACK: ' + JSON.stringify(data))
            };
            page.onUrlChanged = function(targetUrl) {
                console.log('New URL: ' + targetUrl)
            };
            page.settings.userAgent = 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)';
            console.log('start xxxxx');
            console.log('jscode==>', data['jscode']);

            if (data['page']!==undefined&&data['page'].trim()!=''){
                     page.content=data['page']
                     spider(page, request, response, data, status)
             } else {


                var header={}
                var body=''
                if(data['body']!=undefined&&(body==undefined||isEmpty(body))){

                    body= get_kv( build_header( data['body']))
                    if(isEmpty(body)) {
                        console.log('undefine xxxxxxxxxxxxxxxxxxx')
                        body = get_kv(build_data(data['body'].replace(/\n/g, '')))
                    }
                    if(!isEmpty(body)){
                        console.log('body==>',obj2string(body))
                        postdata=''
                        for(k in body ){
                            postdata+=k+ '='+ encodeURIComponent(body[k])+'&'
                        }
                        if(postdata.length>0){
                            body=postdata.substring(0,postdata.length-1)
                        }


                    } else {
                        body = data['body'].replace(/\n/g, '')
                    }
                }
                if(data['header']!=undefined&&(header==undefined||isEmpty(header))){
                    header= get_kv( build_header( data['header']))
                }
					console.log("header==>",obj2string(header))

                if(!isEmpty(header)){
                    page.customHeaders=header
					var cookies=header['Cookie']||header['cookie']
					try{
						var cc=cookies.split(';')
						for(var i in cc) {
							var kv=cc[i].split('=')
							if(kv.length>1) {
								page.addCookie({
								  'name'     : kv[0],   /* required property */
								  'value'    : kv[1],  /* required property */
								  //'domain'   : 'localhost',
								  'path'     : '/',                /* required property */
								  'httponly' : true,
								  //'secure'   : false,
								  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
								});
							}
						}
					} catch(e) {
						
						console.log(e)
					}
                }
				


                if(body.trim()!=''){

                    page.open(data['url'],'POST',body,
                    function (status) {
                        spider(page, request, response, data, status)
                    });

                } else {
                    page.open(data['url'],
                    function (status) {
                        spider(page, request, response, data, status)
                    });
                }

            }
        } catch(er) {
            console.log('page open', er);
            response.statusCode = 500;
            content = 'error'
        }
    } else if (uri.indexOf('.js') > 0) {
        content = get_file_content(uri.substring(1, uri.length));
        response.write(content);
        response.close()
    } else {
        content = get_file_content('index.html');
        response.write(content);
        response.close()
    }
});

function spider(page, request, response, data, status) {

    if (status !== 'success' && (data['page']===undefined ||data['page'].trim()=='')) {
        response.statusCode = 500;
        response.write('errorxxx');
        response.close();
        console.log('Unable to access the website')
    } else {


         if (data['page']!==undefined&&data['page'].trim()!=''){
            page.content=data['page']
             console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
          //  page.evaluateJavaScript('function() { transaleurl("'+data['url']+'") }  ')
        }
        page.injectJs('jquery.js');
        page.injectJs('util.js');

        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx',data['url'])
        page.evaluateJavaScript('function() { transaleurl("'+data['url']+'") }  ')

        if (data['page']!==undefined&&data['page'].trim()!=''){
            page.evaluateJavaScript('function() { transaleurl("'+data['url']+'") }  ')
        } else {
           page.evaluateJavaScript('function() { transaleurl() }  ')
        }

        try {
            response.statusCode = 200;
            var script1 = 'function(){ window.phantomVar=function  __jscode__(){/*' + data['jscode'] + '*/}}';
            var script2 = "function(){ console.log('jscode==>', heredoc(window.phantomVar)); }";
            page.evaluateJavaScript(script1);
            page.evaluateJavaScript(script2);
            var val = '';
            waitFor(function() {
                val = page.evaluateJavaScript('function(){ window.phantomValue= eval(heredoc(window.phantomVar)); return window.phantomValue; }');
                if (data['jscode'].trim() == '') {
                    return true
                }
                if (isEmptyObject(val)) {
                    return false
                } else {
                    return true
                }
            },
            function() {
                if (val == null) {
                    val = ""
                }
                if (typeof(val) === 'object') {
                    try {
                        val = JSON.stringify(val)
                    } catch(e) {
                        console.log(e);
                        val = obj2string(val)
                    }
                }
                if (data['jscode'].trim() == '') {
                    response.write(page.content)
                } else {
                    response.write(val)
                }
                response.close();
                page.close();
                if (data['posturl'] !== undefined && data['posturl'] != '') {
                    var server_post = require('webpage').create();
                    val = JSON.stringify(val);
                    server_post.open(data['posturl'], 'POST', 'data=' + encodeURIComponent(val),
                    function(status) {
                        if (status !== 'success') {
                            console.log('Unable to post!')
                        } else {
                            console.log(server_post.content)
                        }
                        server_post.close()
                    })
                }
            },
            function() {
                if (data['jscode'].trim() == '') {
                    response.write(page.content)
                } else {
                    if (typeof(val) === 'object') {
                        try {
                            val = JSON.stringify(val)
                        } catch(e) {
                            console.log(e);
                            val = obj2string(val)
                        }
                    }
                    response.write(val)
                }
                response.close();
                page.close()
            })
        } catch(er) {
            console.log("eval js", er);
            if (typeof(er) === 'object' || er == null) {
                response.write(obj2string(er))
            } else {
                response.write(er)
            }
            response.close();
            page.close()
        }
    }
}