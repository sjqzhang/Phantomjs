String.prototype.trim=function()
{
     return this.replace(/(^\s*)|(\s*$)/g,'');
}

function table_data(selector) {
	var data = []
	$('table tr', $(selector)).each(function() {
		var row = []
		$('td,th', $(this)).each(function() {
			row.push($(this).text().trim())
		})
		data.push(row)
	})
	return data
}

function obj2json(data) {
	return JSON.stringify(data)
}

function href_data(selector) {

	var data = []
	$('a', $(selector)).each(function() {

		var href = $(this).attr('href');
		var title = $(this).text().trim()
		data.push({
			href : href,
			title : title
		})
	})

	return data

}

function html_data(selector) {
	return $(selector).html()
}

function text_data(selector) {
	return $(selector).html()
}

function include_js(url) {
	$.getScript(url)
}

function __outerhtml(selector) {

	return $(selector).prop('outerHTML')

}

function out_html(selector) {
	return __outerhtml(selector)
}

function html_out(selector) {
	return __outerhtml(selector)
}

function json_encode(obj) {

	return obj2json(obj)

}

function json_decode(obj){
	return JSON.parse(obj)
	
}

function out(obj){
	
	
	return json_encode(obj)
	
}

function print(obj){
	
	return json_encode(obj)
	
}

function obj2string(o){
var r=[];
if(typeof o=="string"){
  return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
}
if(typeof o=="object"){
  if(!o.sort){
   for(var i in o){
    r.push(i+":"+obj2string(o[i]));
   }
   if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
    r.push("toString:"+o.toString.toString());
   }
   r="{"+r.join()+"}";
  }else{
   for(var i=0;i<o.length;i++){
    r.push(obj2string(o[i]))
   }
   r="["+r.join()+"]";
  }
  return r;
}
return o.toString();
}

function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

function heredoc(f){
    return hereDoc(f)
}



function loadScript(url) {
    var script = document.createElement( 'script' );
    script.setAttribute( 'src', url+'?'+'time='+Date.parse(new Date()));  
    document.body.appendChild( script );
  };

  
function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol,
        hostname: a.hostname,
		host: a.host,
        port: a.port,
        query: a.search,
		search: a.search,
        params: (function() {
            var ret = {},
            seg = a.search.replace(/^\?/, '').split('&'),
            len = seg.length,
            i = 0,
            s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
		pathname:a.pathname,
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

function transaleurl(url) {

    if (url===undefined){
        url=window.location.href
    }

//    var urlparts = window.location
    var urlparts = parseURL(url)
    var baseurl = urlparts.protocol + '//' + urlparts.host
    var idx = urlparts.pathname.lastIndexOf('/')
    var relativeurl =baseurl+urlparts.pathname.substring(0, idx)
    $('a').each(function() {
        var href = $(this).attr('href')
        if (href != undefined) {
			href=href.trim()
			href=href.replace('about://','')
            if ( href.indexOf('http')==0 || href.indexOf('(') > 0 || href.indexOf('javascript')==0 || href.indexOf('//')==0 ) {
               //
            } else if (href.indexOf('/') == 0) {
                 $(this).attr('href', baseurl + href)
            } else {
                $(this).attr('href', relativeurl + '/' + href)
            }
        }
    })
    $('img').each(function() {
        var href = $(this).attr('src')
        if (href != undefined) {
			href=href.trim()
			href=href.replace('about://','')
            if ( href.indexOf('http')==0 || href.indexOf('(') > 0 || href.indexOf('javascript')==0 || href.indexOf('//')==0) {
                //
            } else if (href.indexOf('/') == 0) {
				 $(this).attr('src', baseurl + href)
            } else {
                $(this).attr('src', relativeurl + '/' + href)
            }
        }
    })

}

//transaleurl()


function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                   // phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};


function get_pages(selector){
	var hrefs={}
	$('a',selector).each(function(i){
		var href=$(this).attr('href')
		console.log(href)
		if(href!==undefined&&href.length>0&&hrefs[href]==undefined&& href.substring(href.length-1)!='#') {
			hrefs[href]=''
		}
	})
	var urls=[]
	for(var i in hrefs){
		urls.push(i)
	}
	return urls
	console.log(hrefs)
}

function get_files(selector){
	var hrefs={}
    var urls=[]
	$('a',selector).each(function(i){
		var href=$(this).attr('href')
		console.log(href)
		if(href!==undefined&&href.length>0&&hrefs[href]==undefined&& href.substring(href.length-1)!='#') {
            var title=$.trim($(this).text())
			hrefs[href]= title
            urls.push({'href':href,'title':title})
		}
	})
    return urls;
}
