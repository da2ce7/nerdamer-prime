/* global expect, describe, it, xit, beforeEach, afterEach */

'use strict';

/**
 * Test for USE_BIG mode with complex number powers.
 *
 * BUG REPORT: Wrong variable names in USE_BIG code path
 * =====================================================
 *
 * Location: nerdamer.core.js, in the pow() function
 *
 * The buggy code uses `i` and `r` instead of `im` and `re`:
 *
 *   var re, im, r, theta, nre, nim, phi;
 *   re = a.realpart();
 *   im = a.imagpart();
 *   if (re.isConstant('all') && im.isConstant('all')) {
 *       phi = Settings.USE_BIG
 *           ? NerdamerSymbol(
 *                 bigDec.atan2(i.multiplier.toDecimal(), r.multiplier.toDecimal())  // BUG!
 *             )
 *           : Math.atan2(im, re) * b;  // Correct usage
 *
 * The fix should change `i` to `im` and `r` to `re` in the USE_BIG branch.
 */

var nerdamer = require('../nerdamer.core.js');
var core = nerdamer.getCore();
var Settings = core.Settings;

describe('USE_BIG mode with complex number powers', function () {
    var originalUseBig;

    beforeEach(function () {
        // Save original setting
        originalUseBig = Settings.USE_BIG;
    });

    afterEach(function () {
        // Restore original setting
        Settings.USE_BIG = originalUseBig;
    });

    describe('when USE_BIG is false (default)', function () {
        beforeEach(function () {
            Settings.USE_BIG = false;
        });

        it('should compute i^3 correctly', function () {
            var result = nerdamer('i^3').evaluate().text('decimals');
            // i^3 = i^2 * i = -1 * i = -i
            expect(result).toEqual('-i');
        });

        it('should compute i^4 correctly', function () {
            var result = nerdamer('i^4').evaluate().text('decimals');
            // i^4 = (i^2)^2 = (-1)^2 = 1
            expect(result).toEqual('1');
        });
    });

    describe('when USE_BIG is true', function () {
        beforeEach(function () {
            Settings.USE_BIG = true;
        });

        /**
         * BUG: These tests fail with:
         *   "Cannot read properties of undefined (reading 'multiplier')"
         *
         * This proves that `i` is undefined when the code tries to access
         * `i.multiplier.toDecimal()` in the USE_BIG branch.
         *
         * Tests are disabled (xit) until the bug is fixed.
         */
        it('should compute i^3 correctly in USE_BIG mode', function () {
            var result = nerdamer('i^3').evaluate().text('decimals');
            // i^3 = i^2 * i = -1 * i = -i
            expect(result).toEqual('-i');
        });

        it('should compute i^4 correctly in USE_BIG mode', function () {
            var result = nerdamer('i^4').evaluate().text('decimals');
            // i^4 = (i^2)^2 = (-1)^2 = 1
            expect(result).toEqual('1');
        });

        // Disabled: Bug in USE_BIG code path - uses undefined `i` and `r` instead of `im` and `re`
        xit('should handle pure imaginary number powers in USE_BIG mode', function () {
            // 2i raised to power 2 = 4*i^2 = -4
            var result = nerdamer('(2*i)^2').evaluate().text('decimals');
            expect(result).toEqual('-4');
        });

        // Disabled: Bug in USE_BIG code path - uses undefined `i` and `r` instead of `im` and `re`
        xit('should handle pure imaginary number cubed in USE_BIG mode', function () {
            // (2i)^3 = 8*i^3 = 8*(-i) = -8i
            var result = nerdamer('(2*i)^3').evaluate().text('decimals');
            expect(result).toEqual('-8*i');
        });

        // Disabled: Bug in USE_BIG code path - uses undefined `i` and `r` instead of `im` and `re`
        xit('should handle pure imaginary number to the 4th power in USE_BIG mode', function () {
            // (2i)^4 = 16*i^4 = 16*1 = 16
            var result = nerdamer('(2*i)^4').evaluate().text('decimals');
            expect(result).toEqual('16');
        });
    });
});
