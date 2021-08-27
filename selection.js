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

class SelectionSort extends Sort {
    sort(originalArray) {
        // Clone original array to prevent its modification.
        const array = [...originalArray];

        for (let i = 0; i < array.length - 1; i += 1) {
            let minIndex = i;

            // Call visiting callback.
            this.callbacks.visitingCallback(array[i]);

            // Find minimum element in the rest of array.
            for (let j = i + 1; j < array.length; j += 1) {
                // Call visiting callback.
                this.callbacks.visitingCallback(array[j]);

                if (this.comparator.lessThan(array[j], array[minIndex])) {
                    minIndex = j;
                }
            }

            // If new minimum element has been found then swap it with current i-th element.
            if (minIndex !== i) {
                [array[i], array[minIndex]] = [array[minIndex], array[i]];
                let o = {
                    array: array,
                    swap: "swapped " + array[i] + " with " + array[minIndex] + "\n",
                    swapElements: [array[i], array[minIndex]],
                    finished: false
                }
                self.postMessage(o)
            }
        }

        let o = {
            array: array,
            swap: "swapped \n",
            swapElements: [array[i], array[minIndex]],
            finished: false
        }
        self.postMessage(o)

        return array;
    }
}


self.addEventListener('message', function (e) {
    var bs = new SelectionSort()
    var bsdata = bs.sort(e.data)
    let o = {array: bsdata, swap: "finished\n", swapElements: [], finished: true}
    self.postMessage(o)
})