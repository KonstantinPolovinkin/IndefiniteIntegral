/* eslint-disable linebreak-style */
/* eslint-disable arrow-parens */
/* eslint-disable linebreak-style */
/* eslint-disable template-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable camelcase */
'use strict';

const WebSocket = require('ws');
const port = 8000;
const server = new WebSocket.Server({ port });
const arr = [];

server.on('connection', ws => {
  ws.on('message', message => {
    if (message === 'exit') {
      ws.close();
    } else {
      server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          main(getEnteredData(message));
          client.send(arr.join(', '));
          arr.splice(0, arr.length);
          //client.send(`${message} + 1`);
        }
      });
    }
  });
  const newLocal = 'Input integral to solve';
  ws.send(newLocal);
});



function stringReplaceSymbol(value) {
  value = value.replace(/\s/g, '');
  value = value.replace(/(\^\(-)/g, '$');
  value = value.replace(/-/g, ' -');
  //value = value.replace(/\*/g, ' ');
  //value = value.replace(/\//g, ' ');
  value = value.replace(/\+/g, ' ');
  return (value);
}

function stringSplit(value) {
  value = value.split(/\s/g);

  value.forEach((item, itemIndex) => {
    if (item.includes('$')) {
      const newItem = item.replace('$', '^(-');
      value.splice(itemIndex, 1, newItem);
    }
  });
  return value;
}

function getEnteredData(message) {
  const enteredData = stringSplit(stringReplaceSymbol(message));
  return enteredData;
}

function getDifferential() {
  return 'x';//document.getElementById('dx').value;
}

const integrate = {
  zeroIntegral: (item) => {
    if (item === '0') {
      arr.push('C');
    }
  },

  constantIntegral: (item) => {
    if (!item.includes('x') && !item.includes('0')) {
      arr.push(`${item}x + C`);
    }
  },

  exponentIntegral: (item) => {
    if (item === `${ item.slice(0, item.indexOf('^')) }^(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      const exponentDetermination = () => {
        const calculateExponent = eval(item.slice(item.indexOf('^') + 2, item.indexOf(')')));
        return (
          Math.round(calculateExponent * 1000) / 1000
        );
      };
      arr.push(`(${item.slice(0, item.indexOf('^'))}^${Math.round((exponentDetermination() + 1) * 1000) / 1000} / ${Math.round((exponentDetermination() + 1) * 1000) / 1000}) + C`);
    }
  },

  logarithmicIntegral: (item) => {
    if (item === `${ item.slice(0, item.indexOf('/')) }/(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      const nonIntegrandConstant = `(${ item.slice(0, item.indexOf('/')) } / ${ item.slice(item.indexOf('(') + 1, item.indexOf('x') + 1) })`;
      const integrationVariable = getDifferential();
      arr.push(`${nonIntegrandConstant} * ln|${integrationVariable}| + C`);
    }
  },

  exponentialFunctionIntegral_type1: (item) => {
    if (item === `${ item.slice(0, item.indexOf(`^(${getDifferential()})`)) }^(${getDifferential()})`) {
      const numerator = item;
      const denominator = item.slice(0, item.indexOf('^'));
      arr.push(`${numerator} / (ln|${denominator}|) + C`);
    }
  },

  exponentialFunctionIntegral_type2: (item) => {
    if (item === `${ item.slice(0, item.indexOf('s')) }sin(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      const result = item.slice(0);
      arr.push(`${result} + C`);
    }
  },

  sinIntegral_type1: (item) => {
    if (item === `${ item.slice(0, item.indexOf('s')) }sin(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      const integrationVariable = item.slice(item.indexOf('(') + 1, item.indexOf(')'));
      arr.push(`-(${ item.slice(0, item.indexOf('s')) })cos${integrationVariable} + C`);
    }
  },

  cosIntegral_type1: (item) => {
    if (item === `${ item.slice(0, item.indexOf('c')) }cos(${ item.slice(item.indexOf('(') + 1, item.indexOf(')')) })`) {
      const integrationVariable = item.slice(item.indexOf('(') + 1, item.indexOf(')'));
      arr.push(`(${ item.slice(0, item.indexOf('c')) })sin${integrationVariable} + C`);
    }
  },

  sinIntegral_type2: (item) => {
    if (item.includes('sin^')) {
      const integrationVariable = item.slice(item.indexOf(')') + 2, item.indexOf('x') + 1);
      arr.push(`-${ item.slice(0, item.indexOf('s')) }ctg(${integrationVariable}) + C`);
    }
  },

  cosIntegral_type2: (item) => {
    if (item.includes('cos^')) {
      const integrationVariable = item.slice(item.indexOf(')') + 2, item.indexOf('x') + 1);
      arr.push(`${ item.slice(0, item.indexOf('c')) }tg(${integrationVariable}) + C`);
    }
  }
};

function main(getEnteredData) {
  const arr = [];
  for (const item of getEnteredData) {
    for (const pos in integrate) {
      integrate[pos](item);
    }
  }
  return arr;
}
