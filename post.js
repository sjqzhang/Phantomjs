// Example using HTTP POST operation

var page = require('webpage').create(),
    server = 'http://172.17.140.133:8081/index.php',
    data = 'universe=expanding&answer=42';

page.open(server, 'post', data, function (status) {
    if (status !== 'success') {
        console.log('Unable to post!');
    } else {
        console.log(page.content);
    }
   // phantom.exit();
});
