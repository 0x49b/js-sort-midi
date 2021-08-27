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


class InsertionSort extends Sort {
    sort(originalArray) {
        const array = [...originalArray];

        // Go through all array elements...
        for (let i = 1; i < array.length; i += 1) {
            let currentIndex = i;

            // Call visiting callback.
            this.callbacks.visitingCallback(array[i]);

            // Check if previous element is greater than current element.
            // If so, swap the two elements.
            while (
                array[currentIndex - 1] !== undefined
                && this.comparator.lessThan(array[currentIndex], array[currentIndex - 1])
                ) {
                // Call visiting callback.
                this.callbacks.visitingCallback(array[currentIndex - 1]);

                // Swap the elements.
                [
                    array[currentIndex - 1],
                    array[currentIndex],
                ] = [
                    array[currentIndex],
                    array[currentIndex - 1],
                ];

                let o = {
                    array: array,
                    swap: "swapped " + array[currentIndex - 1] + " with " + array[currentIndex] + "\n",
                    swapElements: [array[currentIndex - 1], array[currentIndex]],
                    finished: false
                }
                self.postMessage(o)

                // Shift current index left.
                currentIndex -= 1;
            }
        }

        return array;
    }
}


self.addEventListener('message', function (e) {
    var bs = new InsertionSort()
    var bsdata = bs.sort(e.data)
    let o = {array: bsdata, swap: "finished\n", swapElements: [], finished: true}
    self.postMessage(o)
})