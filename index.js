function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}

function obj2string(o){
var r=[];
if(typeof o=="string"){
  return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
}
if(typeof o=="object"){
    if(o==null){
        return 'null'
    }
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

function waitFor(testFx, onReady,onTimeout, timeOutMillis) {
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
                     typeof(onTimeout) === "string" ? eval(onTimeout) : onTimeout();
                     clearInterval(interval);
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



var system = require('system');

var fs = require('fs');


function get_file_content(filename){

var  content=  fs.read(filename)

   // console.log(content)

    return content

}


function isEmptyObject( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	}


var webserver = require('webserver');
var server = webserver.create();
 port=8080
if( system.args.length ==2) {
    port= parseInt(system.args[1])
}
if (!port){
    port=8080
}



console.log('server port:'+port)


var service = server.listen(port, function(request, response) {


//	console.log(obj2string(request))

    uri=request.url


    console.log(uri)



//   console.log( )
   var  content=''
      response.statusCode = 200;


    if(uri=='/api' || uri=='/api/'){

        try {

                var data={}
                try {



                var data= request.post
                 if(typeof(data)==='string'){

					  try {

                      //  console.log( obj2string( request.post))

					  data={}


                        
                        var dr = request.post.split('&')
                        console.log( dr.length)
                        for (i = 0; i < dr.length; i++) {
                            var kv = dr[i].split('=')
                            console.log(kv)
                            data[kv[0]] =decodeURIComponent(kv[1].replace(/\+/ig,' '))

                        }

                       // response.write(obj2string(data))
                      //  response.close()

            //            console.log(obj2string(data))

                    }catch (er) {

                        console.log("data tran",er)
                    }
				 
				 }


				

                 

                }catch (e) {

                    console.log('e',e)

                    try {

                      //  console.log( obj2string( request.post))



                        var dr = request.post.split('&')
                        console.log( dr.length)
                        for (i = 0; i < dr.length; i++) {
                            var kv = dr[i].split('=')
                            console.log(kv)
                            data[kv[0]] =decodeURIComponent(kv[1].replace(/\+/ig,' '))

                        }

                       // response.write(obj2string(data))
                      //  response.close()

            //            console.log(obj2string(data))

                    }catch (er) {

                        console.log("data tran",er)
                    }

                }



//            console.log(data['jscode'])

          // return spider(request, response,data['url'],data['jscode'])

            var page = require('webpage').create();
            page.onResourceRequested = function(requestData, networkRequest) {
               // console.log(obj2string(requestData))
					 console.log(requestData.url)
             // console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
            };

            if (data['js']==0)
            {
		   
				page.onResourceRequested = function(requestData, request) {

					//console.log(data)
					if ((/http:\/\/.+?\.css/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'text/css') {
						//console.log('The url of the request is matching. Aborting: ' + requestData['url']);
						request.abort();
					}
					if ((/http:\/\/.+?\.js/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'text/javascript') {
						//console.log('The url of the request is matching. Aborting: ' + requestData['url']);
						request.abort();
					}
					if ((/http:\/\/.+?\.(jpg|png|gif)/gi).test(requestData['url']) || requestData.headers['Content-Type'] == 'image/pjpeg' ||
						 requestData.headers['Content-Type'] == 'image/gif'||requestData.headers['Content-Type'] == 'image/png') {
						//console.log('The url of the request is matching. Aborting: ' + requestData['url']);
						request.abort();
					}
				};
			}

            /*
			page.onNavigationRequested = function(url, type, willNavigate, main) {
			  console.log('Trying to navigate to: ' + url);
			  console.log('Caused by: ' + type);
			  console.log('Will actually navigate: ' + willNavigate);
			  console.log('Sent from the page\'s main frame: ' + main);
			}
			*/

			page.onAlert = function(msg) {
			  console.log('ALERT: ' + msg);
			};
			page.onCallback = function(data) {
			  console.log('CALLBACK: ' + JSON.stringify(data));
			  // Prints 'CALLBACK: { "hello": "world" }'
			};
			page.onUrlChanged = function(targetUrl) {
			  console.log('New URL: ' + targetUrl);
			};

            page.settings.userAgent = 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)';
            var ajaxUrl = 'http://cdn.staticfile.org/jquery/2.0.3/jquery.min.js';

            console.log('start xxxxx')

				 console.log('data==>',data)

            page.open(data['url'], function (status){

				/*

				var cookies = page.cookies;
  
				  console.log('Listing cookies:');
				  for(var i in cookies) {
					 console.log( obj2string(cookies[i]))
					console.log(cookies[i].name + '=' + cookies[i].value);
				  }
                */
            

               if (status !== 'success') {
                  response.statusCode = 500;
                  response.write('errorxxx');
                  response.close();

                        console.log('Unable to access the website');
                } else {


                       //   console.log( page.injectJs('jquery.js'))




                   page.injectJs('jquery.js')
                   page.injectJs('util.js')

                   try {

                      response.statusCode = 200;
                       var ajaxUrl = 'http://cdn.staticfile.org/jquery/2.0.3/jquery.min.js';

                     //console.log(data['jscode'])

                      var script1 = 'function(){ window.phantomVar=function  __jscode__(){/*'+ data['jscode'] +'*/}}';
                      var script2 = "function(){ console.log('jscode==>', heredoc(window.phantomVar)); }";
                      page.evaluateJavaScript(script1);
                      page.evaluateJavaScript(script2);

//                       page.includeJs(ajaxUrl,function(){
//
//                             var val=  page.evaluate(function(){
//                                return eval('(' + heredoc( window.phantomVar) +')')
//
//                       })
//
//
//
//                      response.write(val)
//                      response.close();
//
//                       })


//                                var val=  page.evaluate(function(){
//                                    try {
//                                        return eval('(' + heredoc(window.phantomVar) + ')')
//                                    } catch (e) {
//                                         return e
//                                    }
//
//                                 })

//                           try {
//
//
//
//                               var val = page.evaluateJavaScript('function(){ window.phantomValue= eval(heredoc(window.phantomVar)); return window.phantomValue; }')
//                           }catch (e) {
//                               val=e
//                           }

                      var val=''

							 waitFor(function() {
            // Check in the page if a specific element is now visible
                        val = page.evaluateJavaScript('function(){ window.phantomValue= eval(heredoc(window.phantomVar)); return window.phantomValue; }')

                                if( data['jscode'].trim()==''){
                                    return true
                                }

                         if(isEmptyObject(val)){
                             return false
                         } else {
                             return true;
                         }

        }, function() {

				//page.switchToFocusedFrame()

                          if(val==null) {
                              val=""
                          }
                          if(typeof(val)==='object') {
							  try
							  {
								val=JSON.stringify(val)
							  }
							  catch (e)
							  {
								  console.log(e)
								  val=obj2string(val)
							  }
                              
                          } 

                      if(data['jscode'].trim()=='') {
						response.write(page.content)					

					    
					  } else {
						 response.write(val)
					  }
                      response.close();
					  page.close()
					 // setTimeout(function() { page.close();console.log('close')},4000)
                        

                      if(data['posturl']!==undefined&&data['posturl']!='') {



                          var server_post = require('webpage').create()

                          val= JSON.stringify(val)



                            server_post.open(data['posturl'], 'POST',  'data='+encodeURIComponent(val) , function (status) {

                                if (status !== 'success') {
                                    console.log('Unable to post!');
                                } else {
                                    console.log(server_post.content);
                                }
                                server_post.close()
                            });
                     }
           
        },function(){
                 if(data['jscode'].trim()=='') {
						response.write(page.content)


					  } else {
                      if(typeof(val)==='object') {
							  try
							  {
								val=JSON.stringify(val)
							  }
							  catch (e)
							  {
								  console.log(e)
								  val=obj2string(val)
							  }

                          }
						 response.write(val)
					  }
                      response.close();
					  page.close()
                          });


						

                   }catch  (er) {
                       console.log("eval js",er)
                         if(typeof(er)==='object'||er==null) {
                              response.write(obj2string(er))
                          } else {
                              response.write(er)

                          }
                        response.close();
                       page.close()
                   }






                    //page.evaluateJavaScript(get_file_content('jquery.js'));

               }
            })

        } catch(er) {

            console.log('page open',er)

             response.statusCode = 500;
            content='error'

        }

    } else if (uri.indexOf('.js')>0) {
          content= get_file_content(uri.substring(1,uri.length))
          response.write(content);
          response.close();


    } else {
	//  console.log(request.post.type)
         content= get_file_content('index.html')
          response.write(content);
    response.close();


       // console.log(content)


    }










});




function spider(request,response,url,jscode) {




var url = 'http://www.kancloud.cn/kancloud/css-tools-frameworks-libraries-2015';
var ajaxUrl = 'http://cdn.staticfile.org/jquery/2.0.3/jquery.min.js';
var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)';
console.log('The default user agent is ' + page.settings.userAgent);
//phantom.exit();

page.open(url, function (status) {
    if (status !== 'success') {
						  response.statusCode = 500;
  response.write('errorxxx');
  response.close();

        console.log('Unable to access the website');
    } else {
        // 加载jQuery(

		console.log('xxxxxxxxxxxxxxxxxx')

        page.includeJs(ajaxUrl, function(jscode){
            var val = page.evaluate(function(){

                console.log('jscode',jscode)

                return jscode

            }(jscode));

						  response.statusCode = 200;
  response.write(val);
  response.close();
            console.log('The register address: ' + val);
           // phantom.exit();
        });
    };

}(jscode));

}



/*



var url = 'http://www.baidu.com/';
var ajaxUrl = 'http://cdn.staticfile.org/jquery/2.0.3/jquery.min.js';
var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)';
console.log('The default user agent is ' + page.settings.userAgent);
//phantom.exit();

page.open(url, function (status) {
    if (status !== 'success') {
						  response.statusCode = 200;
  response.write('error');
  response.close();

        console.log('Unable to access the website');
    } else {
        // 加载jQuery(

		console.log('xxxxxxxxxxxxxxxxxx')
        var data={}

        page.onConsoleMessage = function(msg) {
          console.log('CONSOLE: ' + msg);
        };
        data['jscode']="$('a').text()"



            page.injectJs('jquery.js')
			page.injectJs('util.js')


// var script1 = 'function(){ window.phantomVar="'+data['jscode']+'"; }';
 var script1 = 'function(){ window.phantomVar= function __jscode__(){*/
/*'+ data['jscode'] +'*//*
} }';
  var script2 = "function(){ console.log( heredoc(window.phantomVar)); }";
  page.evaluateJavaScript(script1);
  page.evaluateJavaScript(script2);

        page.includeJs(ajaxUrl, function(status){
            console.log('status',obj2string(arguments))
            var val = page.evaluate(function(){

               // console.log("xxxxxxx",jscode)

              //  return $('a').text()

                return eval('(' + heredoc( window.phantomVar) +')')

//                return jscode()


             //   return heredoc(jscode)


            });

            response.statusCode = 200;
  response.write(val);
  response.close();


         //   console.log('The register address: ' + val);
           // phantom.exit();
        });
    };

});


});*/
