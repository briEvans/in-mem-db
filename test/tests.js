const assert = require('assert');
const path = require('path');
const clone = require('clone');
const myDB = require(path.resolve('./myDB'));

describe ('DB::Get', function () {
	it ('should return null for non-existant entries', function () {
		let db = new myDB();

	    assert.equal(db.get('a'), null);
	    assert.equal(db.get('', null));
	});

	it ('should return appropriate vals for existing entries', function () {
		let db = new myDB();

		db.data = [{
			'a' : 'apples',
			'b' : 'banana'
		}];

		assert.equal(db.get('a'), 'apples');
		assert.equal(db.get('b'), 'banana');
	});
});

describe ('DB::Set', function () {
	it('should set well formed name value pairs', function () {
		let db = new myDB();

	 	db.set('a', 'apples');
	 	db.set('b', 'banana');
	 	assert.equal(db.get('a'), 'apples');
	    assert.equal(db.get('b'), 'banana');
	});

	it('should handle malformed name value pairs', function () {
		let db = new myDB();

 		db.set('', '');
 		assert.equal(db.get(''), null);
 		db.set('a');
 		assert.equal(db.get('a'), null);
    });

	it('should handle setting duplicates', function () {
		let db = new myDB();

 		db.set('a', 'apples');
 		db.set('a', 'apricots');
        assert.equal(db.get('a'), 'apricots');
    });
});

describe ('DB::Delete', function () {
	it('should remove no elements', function () {
		let db = new myDB('database');

	 	db.set('a', 'apples');
	 	db.set('b', 'banana');
		db.set('c', 'cherries');

	 	db.delete();
	 	assert.equal(db.get('a'), 'apples');
	    assert.equal(db.get('b'), 'banana');
	    assert.equal(db.get('c'), 'cherries');

	});

	it('should remove first element', function () {
		let db = new myDB();

	 	db.set('a', 'apples');
	 	db.set('b', 'banana');
		db.set('c', 'cherries');

	 	db.delete('a');
	 	assert.equal(db.get('a'), null);
	    assert.equal(db.get('b'), 'banana');
	    assert.equal(db.get('c'), 'cherries');
	});

	it('should remove last element', function () {
		let db = new myDB();

	 	db.set('a', 'apples');
	 	db.set('b', 'banana');
		db.set('c', 'cherries');

	 	db.delete('c');
	 	assert.equal(db.get('c'), null);
	    assert.equal(db.get('b'), 'banana');
	    assert.equal(db.get('a'), 'apples');
	});

	it('should remove element at any index', function () {
	let db = new myDB();

	 	db.set('a', 'apples');
	 	db.set('b', 'banana');
		db.set('c', 'cherries');
		db.set('d', 'durian');

	 	db.delete('c');
	 	assert.equal(db.get('c'), null);
	 	assert.equal(db.get('a'), 'apples');
	    assert.equal(db.get('b'), 'banana');
	    assert.equal(db.get('d'), 'durian');
	});
});

describe ('DB::Count', function () {
	it('should find zero matches undefined input', function () {
		let db = new myDB('database');

 		db.set('a', 'apples');
 		db.set('', 'banana');
        assert.equal(db.count(), 0);
    });

	it('should find zero matches natural', function () {
		let db = new myDB('database');

 		db.set('a', 'apples');
 		db.set('', 'banana');
        assert.equal(db.count('banana'), 0);
    });

	it('should find matches', function () {
		let db = new myDB('database');

 		db.set('a', 'apples');
 		db.set('b', 'banana');
 		db.set('c', 'banana');
        assert.equal(db.count('banana'), 2);
    });
});

describe ('DB::Transactions', function () {
	it('should begin a transaction', function () {
		let db = new myDB('database');

		db.set('a', 'apples');
 		db.set('', 'banana');
 		db.begin();
        assert.equal(db.tIndex, 1);
    });

	it('should begin nested transaction', function () {
		let db = new myDB('database');

		db.set('a', 'apples');
 		db.set('b', 'banana');
 		db.begin();
 		db.set('c', 'cherries');
 		db.begin();
        assert.equal(db.tIndex, 2);
    });

	it('should not commit when tindex is 0', function () {
		let db = new myDB('database');

 		db.set('a', 'apples');
 		db.set('', 'banana');
 		db.commit();
        assert.equal(db.tIndex, 0);
    });

	it('should commit transactions when tIndex > 0', function () {
		let db = new myDB('database');

		db.set('a', 'apples');
 		db.set('b', 'banana');
 		db.begin();
 		db.set('c', 'cherries');
 		db.commit();
        assert.equal(db.tIndex, 0);
    });

	it('should not rollback further when tIndex is 0', function () {
		let db = new myDB('database');

		db.set('a', 'apples');
 		db.set('b', 'banana');
 		db.rollback();
 		db.set('c', 'cherries');
 		db.rollback();
        assert.equal(db.tIndex, 0);
    });

	it('should rollback further when tIndex is greater than 0', function () {
		let db = new myDB('database');

		db.set('a', 'apples');
 		db.set('b', 'banana');
 		db.commit();
 		db.commit();
 		db.set('c', 'cherries');
 		db.rollback();
 		db.rollback()
        assert.equal(db.tIndex, 0);
    });
});

