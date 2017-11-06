const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 1337;

var staticContentDir_;

exports.serveFrom = (dir) => {
    staticContentDir_ = dir;
};

function getContentType(path) {
    if(path.indexOf('.css') > 0) return 'text/css';
    if(path.indexOf('.html') > 0) return 'text/html';
    if(path.indexOf('.png') > 0) return 'image/png'
    if(path.indexOf('.js') > 0) return 'application/javascript';

    return 'text/html';
}

function trigger404(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>404 File not found!</h1>');
}

exports.listen = () => {
    let server = http.createServer((req, res) => {
        if(req.url == '/') {
            req.url = '/index.html';
        }
        
        let fullUrl = path.join(__dirname, staticContentDir_) + req.url;
        fs.readFile(fullUrl, (err, data) => {
            if(err) {
                trigger404(res);
                return;
            }
            
            res.statusCode = 200;
            res.setHeader('Content-Type', getContentType(req.url));
            res.end(data);
        });
    });
    
    server.listen(PORT);
};