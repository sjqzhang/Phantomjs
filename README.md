# Phantomjs




```
if($('div[role=columnheader]').length>0){
   $('body').text()
} else {
   false
}
```
 
```
var crawler= async()=>{
  //var js=await loadjs('jquery.js,autil.js');eval(js);
  //var $j=jQuery.noConflict();
  var js=await loadjs('autil.js');eval(js);
  await $('#exec_btn').trigger('click')
 

 
  await sleep(500)


  return $('.table').text()

}

crawler()
```
