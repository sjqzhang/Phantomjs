function table_data(selector) {
	var data = []
	$('table tr', $(selector)).each(function() {
		var row = []
		$('td,th', $(this)).each(function() {
			row.push($(this).text())
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
		var title = $(this).text()
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

	$(selector).prop('outerHTML')

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

String.prototype.trim=function()
{
     return this.replace(/(^\s*)|(\s*$)/g,'');
}