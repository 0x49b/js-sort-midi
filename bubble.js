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


class BubbleSort extends Sort {


    sort(originalArray) {
        // Flag that holds info about whether the swap has occur or not.
        let swapped = false;
        // Clone original array to prevent its modification.
        const array = [...originalArray];

        for (let i = 1; i < array.length; i += 1) {

            swapped = false;

            // Call visiting callback.
            this.callbacks.visitingCallback(array[i]);

            for (let j = 0; j < array.length - i; j += 1) {

                // Call visiting callback.
                this.callbacks.visitingCallback(array[j]);

                // Swap elements if they are in wrong order.
                if (this.comparator.lessThan(array[j + 1], array[j])) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];

                    /*let txtarr = document.getElementById("console")

                    txtarr.value += "swapped " + array[j] + " with " + array[j + 1] + "\n"

                    // make animated
                    let oldelem = document.getElementById("bars-" + array[j])
                    let newelem = document.getElementById("bars-" + array[j + 1])

                    console.log(oldelem.id)
                    newelem.parentNode.insertBefore(oldelem, newelem.parentNode.firstChild)
                    oldelem.parentNode.insertBefore(newelem, oldelem.parentNode.firstChild)
*/
                    let o = {array:array, swap:"swapped " + array[j] + " with " + array[j + 1] + "\n", finished:false}
                    self.postMessage(o)
                    // Register the swap.
                    swapped = true;
                }
            }
            // If there were no swaps then array is already sorted and there is
            // no need to proceed.
            if (!swapped) {
                //let o = {array:array, swap: "no"}
                //    self.postMessage(o)
                return array;
            }

        }

        //let o = {array:array, swap: "no"}
        //self.postMessage(o)
        return array;
    }
}


self.addEventListener('message', function (e) {
    var bs = new BubbleSort()
    var bsdata = bs.sort(e.data)
    let o = {array:bsdata, swap:"finished\n", finished:true}
    self.postMessage(o)
})