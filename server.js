const http = require('http');
const path = require('path');
const express = require('express');

var port = process.env.PORT || 3000;

var app = express();

app.use(express.static(path.join(process.cwd(), 'web')));

app.listen(port);