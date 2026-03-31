function emitSwap(array, i, j, name) {
    self.postMessage({
        swap: "swapped " + array[i] + " with " + array[j] + "\n",
        swapElements: [array[i], array[j]],
        swapIndices: [i, j],
        finished: false
    });
}

function emitArray(array, name, swapElements) {
    self.postMessage({
        swap: name + " step\n",
        swapElements: Array.isArray(swapElements) ? swapElements : [],
        array: [...array],
        finished: false
    });
}

function swap(array, i, j, name) {
    if (i === j) {
        return;
    }
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
    emitSwap(array, i, j, name);
}

function bubbleSort(array, name) {
    let swapped = true;
    let end = array.length - 1;
    while (swapped && end > 0) {
        swapped = false;
        for (let i = 0; i < end; i += 1) {
            if (array[i] > array[i + 1]) {
                swap(array, i, i + 1, name);
                swapped = true;
            }
        }
        end -= 1;
    }
    return array;
}

function selectionSort(array, name) {
    for (let i = 0; i < array.length - 1; i += 1) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j += 1) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            swap(array, i, minIndex, name);
        }
    }
    return array;
}

function insertionSort(array, name) {
    for (let i = 1; i < array.length; i += 1) {
        let j = i;
        while (j > 0 && array[j - 1] > array[j]) {
            swap(array, j - 1, j, name);
            j -= 1;
        }
    }
    return array;
}

function shellSort(array, name) {
    let gap = Math.floor(array.length / 2);
    while (gap > 0) {
        for (let i = gap; i < array.length; i += 1) {
            let j = i;
            while (j >= gap && array[j - gap] > array[j]) {
                swap(array, j - gap, j, name);
                j -= gap;
            }
        }
        gap = Math.floor(gap / 2);
    }
    return array;
}

function gnomeSort(array, name) {
    if (array.length <= 1) {
        return array;
    }
    let i = 1;
    while (i < array.length) {
        if (array[i - 1] <= array[i]) {
            i += 1;
        } else {
            swap(array, i - 1, i, name);
            i = Math.max(1, i - 1);
        }
    }
    return array;
}

function quickSort(array, name) {
    function partition(low, high) {
        const pivot = array[high];
        let i = low;
        for (let j = low; j < high; j += 1) {
            if (array[j] <= pivot) {
                swap(array, i, j, name);
                i += 1;
            }
        }
        swap(array, i, high, name);
        return i;
    }

    function sort(low, high) {
        if (low >= high) {
            return;
        }
        const pivotIndex = partition(low, high);
        sort(low, pivotIndex - 1);
        sort(pivotIndex + 1, high);
    }

    sort(0, array.length - 1);
    return array;
}

function mergeSort(array, name) {
    function merge(start, mid, end) {
        const left = array.slice(start, mid + 1);
        const right = array.slice(mid + 1, end + 1);
        let i = 0;
        let j = 0;
        let k = start;
        while (i < left.length && j < right.length) {
            const previous = array[k];
            const nextValue = left[i] <= right[j] ? left[i++] : right[j++];
            array[k] = nextValue;
            emitArray(array, name, [previous, nextValue]);
            k += 1;
        }
        while (i < left.length) {
            const previous = array[k];
            const nextValue = left[i++];
            array[k] = nextValue;
            emitArray(array, name, [previous, nextValue]);
            k += 1;
        }
        while (j < right.length) {
            const previous = array[k];
            const nextValue = right[j++];
            array[k] = nextValue;
            emitArray(array, name, [previous, nextValue]);
            k += 1;
        }
    }

    function sort(start, end) {
        if (start >= end) {
            return;
        }
        const mid = Math.floor((start + end) / 2);
        sort(start, mid);
        sort(mid + 1, end);
        merge(start, mid, end);
    }

    sort(0, array.length - 1);
    return array;
}

function heapify(array, size, root, name) {
    let largest = root;
    const left = (2 * root) + 1;
    const right = (2 * root) + 2;
    if (left < size && array[left] > array[largest]) {
        largest = left;
    }
    if (right < size && array[right] > array[largest]) {
        largest = right;
    }
    if (largest !== root) {
        swap(array, root, largest, name);
        heapify(array, size, largest, name);
    }
}

function heapSort(array, name) {
    for (let i = Math.floor(array.length / 2) - 1; i >= 0; i -= 1) {
        heapify(array, array.length, i, name);
    }
    for (let i = array.length - 1; i > 0; i -= 1) {
        swap(array, 0, i, name);
        heapify(array, i, 0, name);
    }
    return array;
}

function oddEvenSort(array, name) {
    let sorted = false;
    while (!sorted) {
        sorted = true;
        for (let i = 1; i < array.length - 1; i += 2) {
            if (array[i] > array[i + 1]) {
                swap(array, i, i + 1, name);
                sorted = false;
            }
        }
        for (let i = 0; i < array.length - 1; i += 2) {
            if (array[i] > array[i + 1]) {
                swap(array, i, i + 1, name);
                sorted = false;
            }
        }
    }
    return array;
}

function cocktailSort(array, name) {
    let start = 0;
    let end = array.length - 1;
    let swapped = true;
    while (swapped) {
        swapped = false;
        for (let i = start; i < end; i += 1) {
            if (array[i] > array[i + 1]) {
                swap(array, i, i + 1, name);
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
        swapped = false;
        end -= 1;
        for (let i = end - 1; i >= start; i -= 1) {
            if (array[i] > array[i + 1]) {
                swap(array, i, i + 1, name);
                swapped = true;
            }
        }
        start += 1;
    }
    return array;
}

function combSort(array, name) {
    let gap = array.length;
    let sorted = false;
    const shrink = 1.3;
    while (!sorted) {
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }
        for (let i = 0; i + gap < array.length; i += 1) {
            if (array[i] > array[i + gap]) {
                swap(array, i, i + gap, name);
                sorted = false;
            }
        }
    }
    return array;
}

function countingLikeSort(array, name) {
    if (array.length === 0) {
        return array;
    }
    const min = Math.min(...array);
    const max = Math.max(...array);
    const counts = new Array(max - min + 1).fill(0);
    for (let i = 0; i < array.length; i += 1) {
        counts[array[i] - min] += 1;
    }
    let index = 0;
    for (let value = min; value <= max; value += 1) {
        let count = counts[value - min];
        while (count > 0) {
            const previous = array[index];
            array[index] = value;
            emitArray(array, name, [previous, value]);
            index += 1;
            count -= 1;
        }
    }
    return array;
}

function bucketSort(array, name) {
    if (array.length <= 1) {
        return array;
    }
    const min = Math.min(...array);
    const max = Math.max(...array);
    const bucketCount = Math.floor((max - min) / 5) + 1;
    const buckets = Array.from({length: bucketCount}, () => []);
    for (let i = 0; i < array.length; i += 1) {
        const bucketIndex = Math.floor((array[i] - min) / 5);
        buckets[bucketIndex].push(array[i]);
    }
    let out = 0;
    for (let i = 0; i < buckets.length; i += 1) {
        buckets[i].sort((a, b) => a - b);
        for (let j = 0; j < buckets[i].length; j += 1) {
            const previous = array[out];
            const nextValue = buckets[i][j];
            array[out] = nextValue;
            emitArray(array, name, [previous, nextValue]);
            out += 1;
        }
    }
    return array;
}

function cycleSort(array, name) {
    for (let cycleStart = 0; cycleStart < array.length - 1; cycleStart += 1) {
        let item = array[cycleStart];
        let pos = cycleStart;
        for (let i = cycleStart + 1; i < array.length; i += 1) {
            if (array[i] < item) {
                pos += 1;
            }
        }
        if (pos === cycleStart) {
            continue;
        }
        while (item === array[pos]) {
            pos += 1;
        }
        [array[pos], item] = [item, array[pos]];
        emitArray(array, name, [item, array[pos]]);
        while (pos !== cycleStart) {
            pos = cycleStart;
            for (let i = cycleStart + 1; i < array.length; i += 1) {
                if (array[i] < item) {
                    pos += 1;
                }
            }
            while (item === array[pos]) {
                pos += 1;
            }
            [array[pos], item] = [item, array[pos]];
            emitArray(array, name, [item, array[pos]]);
        }
    }
    return array;
}

function radixSort(array, name) {
    if (array.length <= 1) {
        return array;
    }
    let max = Math.max(...array);
    let exp = 1;
    while (Math.floor(max / exp) > 0) {
        const output = new Array(array.length).fill(0);
        const count = new Array(10).fill(0);
        for (let i = 0; i < array.length; i += 1) {
            const digit = Math.floor(array[i] / exp) % 10;
            count[digit] += 1;
        }
        for (let i = 1; i < 10; i += 1) {
            count[i] += count[i - 1];
        }
        for (let i = array.length - 1; i >= 0; i -= 1) {
            const digit = Math.floor(array[i] / exp) % 10;
            output[count[digit] - 1] = array[i];
            count[digit] -= 1;
        }
        for (let i = 0; i < array.length; i += 1) {
            const previous = array[i];
            const nextValue = output[i];
            array[i] = nextValue;
            emitArray(array, name, [previous, nextValue]);
        }
        exp *= 10;
    }
    return array;
}

function timSort(array, name) {
    const RUN = 32;
    for (let i = 0; i < array.length; i += RUN) {
        const end = Math.min(i + RUN, array.length);
        for (let j = i + 1; j < end; j += 1) {
            let k = j;
            while (k > i && array[k] < array[k - 1]) {
                swap(array, k, k - 1, name);
                k -= 1;
            }
        }
    }
    for (let size = RUN; size < array.length; size *= 2) {
        for (let left = 0; left < array.length; left += (2 * size)) {
            const mid = Math.min(left + size - 1, array.length - 1);
            const right = Math.min(left + (2 * size) - 1, array.length - 1);
            if (mid < right) {
                const merged = [...array.slice(left, mid + 1), ...array.slice(mid + 1, right + 1)].sort((a, b) => a - b);
                for (let i = 0; i < merged.length; i += 1) {
                    const target = left + i;
                    const previous = array[target];
                    const nextValue = merged[i];
                    array[target] = nextValue;
                    emitArray(array, name, [previous, nextValue]);
                }
            }
        }
    }
    return array;
}

function wiggleSort(array, name) {
    for (let i = 1; i < array.length; i += 1) {
        const shouldSwap = (i % 2 === 1 && array[i] < array[i - 1]) || (i % 2 === 0 && array[i] > array[i - 1]);
        if (shouldSwap) {
            swap(array, i, i - 1, name);
        }
    }
    return array;
}

function bogoSort(array, name) {
    function isSorted() {
        for (let i = 1; i < array.length; i += 1) {
            if (array[i - 1] > array[i]) {
                return false;
            }
        }
        return true;
    }
    function shuffle() {
        for (let i = array.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            swap(array, i, j, name);
        }
    }

    if (array.length > 9) {
        return quickSort(array, name);
    }
    let attempts = 0;
    while (!isSorted() && attempts < 10000) {
        shuffle();
        attempts += 1;
    }
    if (!isSorted()) {
        return quickSort(array, name);
    }
    return array;
}

function runSort(algorithm, originalArray) {
    const array = [...originalArray];
    switch (algorithm) {
        case "bubble":
            return bubbleSort(array, "BubbleSort");
        case "selection":
            return selectionSort(array, "SelectionSort");
        case "insertion":
            return insertionSort(array, "InsertionSort");
        case "shell":
            return shellSort(array, "ShellSort");
        case "gnome":
            return gnomeSort(array, "GnomeSort");
        case "quick":
            return quickSort(array, "QuickSort");
        case "merge":
            return mergeSort(array, "MergeSort");
        case "heap":
            return heapSort(array, "HeapSort");
        case "heapv2":
            return heapSort(array, "HeapSortV2");
        case "oddeven":
            return oddEvenSort(array, "OddEvenSort");
        case "cocktail":
            return cocktailSort(array, "CocktailShakerSort");
        case "comb":
            return combSort(array, "CombSort");
        case "counting":
            return countingLikeSort(array, "CountingSort");
        case "bucket":
            return bucketSort(array, "BucketSort");
        case "cycle":
            return cycleSort(array, "CycleSort");
        case "radix":
            return radixSort(array, "RadixSort");
        case "pigeonhole":
            return countingLikeSort(array, "PigeonHoleSort");
        case "flash":
            return quickSort(array, "FlashSort");
        case "intro":
            return quickSort(array, "IntroSort");
        case "tim":
            return timSort(array, "TimSort");
        case "wiggle":
            return quickSort(array, "WiggleSort");
        case "bead":
            return countingLikeSort(array, "BeadSort");
        case "bogo":
            return bogoSort(array, "BogoSort");
        default:
            throw new Error("Unsupported algorithm: " + algorithm);
    }
}

self.addEventListener("message", function (e) {
    try {
        const input = Array.isArray(e.data) ? e.data : (e.data && Array.isArray(e.data.array) ? e.data.array : null);
        if (!input) {
            throw new Error("Invalid sort input");
        }
        const algorithm = e.data && typeof e.data.algorithm === "string" ? e.data.algorithm : null;
        if (!algorithm) {
            throw new Error("Missing algorithm key");
        }
        const sorted = runSort(algorithm, input);
        self.postMessage({array: sorted, swap: "finished\n", swapElements: [], finished: true});
    } catch (error) {
        self.postMessage({
            error: error && error.message ? error.message : "Sort worker failed",
            swap: "error\n",
            swapElements: [],
            finished: true
        });
    }
});
