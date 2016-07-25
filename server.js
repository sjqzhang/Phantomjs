function hereDoc(f) {
    return f.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '')
}
String.prototype.trim=function()
{
     return this.replace(/(^\s*)|(\s*$)/g,'');
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
    if (uri == '/api' || uri == '/api/') {
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
            console.log('data==>', data['jscode']);
            page.open(data['url'],
            function(status) {

                spider(page, request, response, data, status)

            });
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
        }
        page.injectJs('jquery.js');
        page.injectJs('util.js');
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