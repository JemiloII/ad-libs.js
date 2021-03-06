/* global describe, it */

'use strict';

var getExecutingScript = require('../../lib/dom/getExecutingScript'),
	expect             = require('expect.js');

describe('dom/getExecutingScript', function () {
	it('should be able to handle an invalid currentScript', function() {
		expect(getExecutingScript(null, 'invalidness')).not.to.be(null);
		expect(getExecutingScript(null, undefined)).not.to.be(null);
		expect(getExecutingScript(null, null)).not.to.be(null);
	});

	it('should return null if detectScript argument function returns false for all scripts', function() {
		expect(getExecutingScript(function(){return false;})).to.be(null);
	});

	it('should get the script element that loaded the calling javascript.', function (done) {
		// We only care about testing modern browsers for this case.
		// The fallback is handled in the next test.
		if (!'currentScript' in document) {
			done();
			return;
		}

		var el = document.createElement('script');
		el.src = '/base/public/dom-test-verify.js';

		window.getExecutingScriptVerify = function () {
			expect(el).to.equal(getExecutingScript());
			expect(el.getAttribute(getExecutingScript.LOAD_ATTR)).to.equal(getExecutingScript.LOAD_STARTED);
			expect(el.src).to.be.a('string');

			el.parentElement.removeChild(el);
			window.getExecutingScriptVerify = null;

			done();
		};

		document.body.appendChild(el);
	});

	it('should filter the potential executing scripts by the provided detect function.', function (done) {
		var el = document.createElement('script');
		el.setAttribute('FOO', 'dummy value');
		el.src = '/base/public/dom-test-verify.js';

		var detectScriptByAttribute = function (script) {
			return script.getAttribute('FOO') === 'dummy value';
		};

		window.getExecutingScriptVerify = function () {
			expect(el).to.equal(getExecutingScript(detectScriptByAttribute));
			el.parentElement.removeChild(el);
			window.getExecutingScriptVerify = null;

			done();
		};

		document.body.appendChild(el);
	});

});
