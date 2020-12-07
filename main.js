/* eslint-disable arrow-parens */
'use strict';

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('ws or http? ', (answer) => {
  if (answer === 'ws') {
    require('./src/ws/server.js');
  } else {
    require('./src/http/server.js');
  }

  rl.close();
});
