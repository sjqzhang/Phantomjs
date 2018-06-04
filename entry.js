const express = require("express")
const app = express()
const path = require('path')
const bodyParser  = require("body-parser");
const puppeteer = require('puppeteer');
const axios = require('axios');
var fs = require('fs');
const crypto = require('crypto');




function hereDoc(f) {
    return f.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '')
}
String.prototype.trim=function()
{
     return this.replace(/(^\s*)|(\s*$)/g,'');
}

String.prototype.trimScript=function()
{
     return this.replace(/\/\*[\s\S]*?\*\/|^[\/\/][\s\S]*?\n|([\s\t]+\/\/[\s\S]*?\n)/g,"\n");
}

String.prototype.startWith=function(str){     
  var reg=new RegExp("^"+str);     
  return reg.test(this);        
}  

String.prototype.endWith=function(str){     
  var reg=new RegExp(str+"$");     
  return reg.test(this);        
}

var sleep = (time)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('ok');
            reject('err');
        },time)
    })
};

function loadJs(filename){
	var jss=[]
	var files=['jquery.js','autil.js']
	if(filename){
		files=filename.split(',')
	} 
	files.map(function(file){
		if(file.startWith('http:')||file.startWith('https:')){
			(async (jss)=>{
				await axios.get(file).then(function(js){
					jss.push(js)
				})
				await sleep(1000)
			})(jss)
			
			 
		} else {
			var js=fs.readFileSync(file,'utf-8');
			jss.push(js)
		}
	})
	return jss.join("\n")
}

const jss=loadJs().trimScript()

fs.writeFileSync('js.txt', jss)

eval(jss)





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
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis: 5000,
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





app.use(bodyParser.urlencoded({ extended: false }));




app.use(express.static(path.join(__dirname, '.')))

//const browser =async ()=> await puppeteer.launch();

//console.log(browser)



app.post("/api/buildRequest", function (req, res) {
	
	var doc=hereDoc(_PYTHON_REQUEST)
	var data={'body':req.body.body,'header':req.body.header,'js':req.body.js,
	'jscode':req.body.jscode}
	doc=tpl_replace(doc,req.body)
	res.send(doc)
	
})

app.post("/api/pdf", function (req, res) {
  console.log("req", req.body.url);
  
})

app.post("/api/request", function (req, res) {
  console.log("req", req.body.url);
  

  

  (async (req,res) => {
    const browser =await puppeteer.launch({devtools: true,ignoreHTTPSErrors:true});
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();
	page.setRequestInterception(true)
	const client = await page.target().createCDPSession();
	
	
	await page.exposeFunction('md5', text =>
    crypto.createHash('md5').update(text).digest('hex')
	);
	
	await page.exposeFunction('loadjs', (filename) => {
		return loadJs(filename)
	}
	);

    // await page.goto('https://example.com');
    

    // console.log(req.body.jscode)

    const jscode= await req.body.jscode
	
	const url= await req.body.url
	
	const load_image= await req.body.image
	
	const headers= await req.body.header
	
	const postData= await req.body.body
	
	var cookies_array=[]
	
	//console.log(headers)
	
	const header=get_kv(build_header(headers))
	
	
	
	
	try{
		var cookies=header['Cookie']||header['cookie']||''
		
		var cc=cookies.split(';')
		
		for(var i in cc) {
			
			var kv=cc[i].split('=')
			if(kv.length>1) {
				cookies_array.push({
				  'name'     : kv[0],   /* required property */
				  'value'    : kv[1],  /* required property */
				  //'domain'   : 'localhost',
				 // 'domain'	: 'http://gitlab.fenqile.com',
				  'url':url,
				  'path'     : '/',                /* required property */
				  'httponly' : true,
				  //'secure'   : false,
				  'expires'  : (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
				});

			}
		}
		//console.log(cookies_array)
		//page.setCookie(...cookies_array)
		//for(var i in cookies_array) {
			//await page.setCookie(i)
			//console.log(i)
		//	await client.send('Network.setCookie',cookies_array[i]);
		//}
			//const setCookie = await client.send ( 'Network.setCookie',cookies_array);
	} catch(e) {
		
		console.log("xxxxxxxxxxxxx",e)
	}
  
   page.on('request', request => {

	  if(request.resourceType()=='image' && load_image!='1'){
		  
		request.abort()
		
	  }
	  
	  var ignores=['media','eventsource','other']
	  for(var i in ignores){
		if(request.resourceType()==ignores[i]) {
			request.abort()
		}
	  }

	  var cookie=request.headers()
	  
	  if(header['Cookie']){
		  cookie['Cookie']=header['Cookie']
		  if (header['User-Agent']){
			 cookie['User-Agent']=header['User-Agent']
		  }
		  request.continue({
					  'headers':cookie,
		  })
	  }
	  

	  /*
	  
	  if (header['Host']) {
		  var host=header['Host']
		  var r=request.url()
		  var cookie={}
		  var keys=['Accept','Accept-Language','Connection','Content-Type','Cookie','Host','Origin','Referer','User-Agent']
		  
		  keys.map(function(key){
			  if(header[key]) {
			  cookie[key]= header[key]
			  }
		  })

	
		  if (r.indexOf(host)!=-1) {
			  
			  
			  //console.log('beijing',postData)
			 
			  request.continue({
				  'headers':header,
			  })
					  
		  } else {
			   console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
			   request.continue()
		  }
		  
	  } else {
		  
		  request.continue()
					
	  }
	  */
	  

   
    });
   
   try {

    await page.goto(req.body.url);
	

	
	//await page.evaluate(jss)
	
	
	page.evaluateOnNewDocument(function(){
	
	eval(jss)
	
	},jss)
	
	 /*
	page.evaluateOnNewDocument(function(){
		
	function loadScript(url) {
		var script = document.createElement( 'script' );
		script.setAttribute( 'src', url+'?'+'time='+Date.parse(new Date()));  
		document.body.appendChild( script );
		console.log(url)
	  };
	  
	window.onload=function(){
		
		loadScript('http://127.0.0.1:3000/jquery.js')
		loadScript('http://127.0.0.1:3000/autil.js')
	
	}
		
	})
	*/

    var message=''
	if(jscode.trim()=='') {
		message=page.content()
	} else {

		message = await page.evaluate(function (jscode){

				return jscode
		}(jscode));
	
	}

    // await console.log(message)

    await res.send(JSON.stringify(message))
	
	if (req.body.posturl) {
		axios.post(req.body.posturl,{'data':JSON.stringify(message)})
	}
	
	//console.log(await page.cookies())
	
   } catch(e) {
		
		console.log("abcxxx",e)
	}
   

    //console.log(message)
    // await page.screenshot({path: './public/example.png'});

  //  await browser.close();
  })(req,res);

  // res.send("taking screenshot")
});



app.listen(3000, function () {
  console.log("listening on port 3000!")
})
