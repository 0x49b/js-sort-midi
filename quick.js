class Comparator {
    /**
     * Constructor.
     * @param {function(a: *, b: *)} [compareFunction] - It may be custom compare function that, let's
     * say may compare custom objects together.
     */
    constructor(compareFunction) {
        this.compare = compareFunction || Comparator.defaultCompareFunction;
    }

    /**
     * Default comparison function. It just assumes that "a" and "b" are strings or numbers.
     * @param {(string|number)} a
     * @param {(string|number)} b
     * @returns {number}
     */
    static defaultCompareFunction(a, b) {
        if (a === b) {
            return 0;
        }

        return a < b ? -1 : 1;
    }

    /**
     * Checks if two variables are equal.
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    equal(a, b) {
        return this.compare(a, b) === 0;
    }

    /**
     * Checks if variable "a" is less than "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    lessThan(a, b) {
        return this.compare(a, b) < 0;
    }

    /**
     * Checks if variable "a" is greater than "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    greaterThan(a, b) {
        return this.compare(a, b) > 0;
    }

    /**
     * Checks if variable "a" is less than or equal to "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    lessThanOrEqual(a, b) {
        return this.lessThan(a, b) || this.equal(a, b);
    }

    /**
     * Checks if variable "a" is greater than or equal to "b".
     * @param {*} a
     * @param {*} b
     * @return {boolean}
     */
    greaterThanOrEqual(a, b) {
        return this.greaterThan(a, b) || this.equal(a, b);
    }

    /**
     * Reverses the comparison order.
     */
    reverse() {
        const compareOriginal = this.compare;
        this.compare = (a, b) => compareOriginal(b, a);
    }
}

class Sort {
    constructor(originalCallbacks) {
        this.callbacks = Sort.initSortingCallbacks(originalCallbacks);
        this.comparator = new Comparator(this.callbacks.compareCallback);
    }

    /**
     * @param {SorterCallbacks} originalCallbacks
     * @returns {SorterCallbacks}
     */
    static initSortingCallbacks(originalCallbacks) {
        const callbacks = originalCallbacks || {};
        const stubCallback = () => {
        };

        callbacks.compareCallback = callbacks.compareCallback || undefined;
        callbacks.visitingCallback = callbacks.visitingCallback || stubCallback;

        return callbacks;
    }

    sort() {
        throw new Error('sort method must be implemented');
    }
}


class QuickSort extends Sort {
    /**
     * @param {*[]} originalArray
     * @return {*[]}
     */
    sort(originalArray) {
        // Clone original array to prevent it from modification.
        const array = [...originalArray];

        // If array has less than or equal to one elements then it is already sorted.
        if (array.length <= 1) {
            return array;
        }

        // Init left and right arrays.
        const leftArray = [];
        const rightArray = [];

        // Take the first element of array as a pivot.
        const pivotElement = array.shift();
        const centerArray = [pivotElement];

        // Split all array elements between left, center and right arrays.
        while (array.length) {
            const currentElement = array.shift();

            // Call visiting callback.
            this.callbacks.visitingCallback(currentElement);

            if (this.comparator.equal(currentElement, pivotElement)) {
                centerArray.push(currentElement);
            } else if (this.comparator.lessThan(currentElement, pivotElement)) {
                leftArray.push(currentElement);
            } else {
                rightArray.push(currentElement);
            }

        }

        // Sort left and right arrays.
        const leftArraySorted = this.sort(leftArray);
        const rightArraySorted = this.sort(rightArray);

        // Let's now join sorted left array with center array and with sorted right array.
        return leftArraySorted.concat(centerArray, rightArraySorted);
    }
}



self.addEventListener('message', function (e) {
    var bs = new QuickSort()
    var bsdata = bs.sort(e.data)
    let o = {array:bsdata, swap:"finished\n", finished:true}
    self.postMessage(o)
})