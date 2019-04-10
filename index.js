const path = require('path');
const myDB = require(path.resolve('./myDB'));
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let db = new myDB();

console.log('=== In Memory Database [READY] ===');

rl.on('line', (input) => {
	let cmd = input.split(' ');
	let name;
	let value;

	if (cmd.length > 1) {
		name = cmd[1] || null;
		value = cmd[2] || null;
	}

	switch (cmd[0]) {
		case 'SET':
			db.set(name, value);
			break;
		case 'GET':
			console.log(db.get(name));
			break;
		case 'DELETE':
			db.delete('a');
			break;
		case 'COUNT':
			console.log(db.count(name));;
			break;
		case 'BEGIN':
			db.begin();
			break;
		case 'ROLLBACK':
			if (db.rollback() < 0) {
				console.log('TRANSACTION NOT FOUND');
			}
			break;
		case 'COMMIT':
			db.commit();
			break;
		case 'END':
			console.log('===In Memory Database [CLOSING]===');
			rl.close();
			break;
		case 'OPTIONS':
			console.log('options:\nSET <Name> <Val>\n' +
				'GET <Name>\nDELETE <Name>\nCOUNT <value>\n' +
				'BEGIN\nROLLBACK\nCOMMIT\nEND\n');
			break;
		default: 
			console.log('\nDid not understand input. Please try again.\n' +
				'Use OPTIONS to see all possible commands\n');
			break;
	}

	db.manageState();
});
