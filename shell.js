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

class ShellSort extends Sort {
    sort(originalArray) {
        // Prevent original array from mutations.
        const array = [...originalArray];

        // Define a gap distance.
        let gap = Math.floor(array.length / 2);

        // Until gap is bigger then zero do elements comparisons and swaps.
        while (gap > 0) {
            // Go and compare all distant element pairs.
            for (let i = 0; i < (array.length - gap); i += 1) {
                let currentIndex = i;
                let gapShiftedIndex = i + gap;

                while (currentIndex >= 0) {
                    // Call visiting callback.
                    this.callbacks.visitingCallback(array[currentIndex]);

                    // Compare and swap array elements if needed.
                    if (this.comparator.lessThan(array[gapShiftedIndex], array[currentIndex])) {
                        const tmp = array[currentIndex];
                        array[currentIndex] = array[gapShiftedIndex];
                        array[gapShiftedIndex] = tmp;

                        let o = {
                            array: array,
                            swap: "swapped " + array[currentIndex] + " with " + array[gapShiftedIndex] + "\n",
                            swapElements: [array[currentIndex], array[gapShiftedIndex]],
                            finished: false
                        }
                        self.postMessage(o)
                    }

                    gapShiftedIndex = currentIndex;
                    currentIndex -= gap;


                }
            }

            // Shrink the gap.
            gap = Math.floor(gap / 2);
        }

        // Return sorted copy of an original array.
        return array;
    }
}


self.addEventListener('message', function (e) {
    var bs = new ShellSort()
    var bsdata = bs.sort(e.data)
    let o = {array: bsdata, swap: "finished\n", swapElements: [], finished: true}
    self.postMessage(o)
})