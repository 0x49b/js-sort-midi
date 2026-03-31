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

function heapSortV2(array, name) {
    function siftDown(start, end) {
        let root = start;
        while ((2 * root) + 1 <= end) {
            let child = (2 * root) + 1;
            let candidate = root;
            if (array[candidate] < array[child]) {
                candidate = child;
            }
            if (child + 1 <= end && array[candidate] < array[child + 1]) {
                candidate = child + 1;
            }
            if (candidate === root) {
                return;
            }
            swap(array, root, candidate, name);
            root = candidate;
        }
    }

    for (let start = Math.floor((array.length - 2) / 2); start >= 0; start -= 1) {
        siftDown(start, array.length - 1);
    }
    for (let end = array.length - 1; end > 0; end -= 1) {
        swap(array, 0, end, name);
        siftDown(0, end - 1);
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

function pigeonholeSort(array, name) {
    if (array.length <= 1) {
        return array;
    }
    for (let i = 0; i < array.length; i += 1) {
        if (!Number.isInteger(array[i])) {
            throw new Error("PigeonHoleSort requires integer values");
        }
    }
    const min = Math.min(...array);
    const max = Math.max(...array);
    const holeCount = (max - min) + 1;
    const holes = Array.from({length: holeCount}, () => []);
    for (let i = 0; i < array.length; i += 1) {
        holes[array[i] - min].push(array[i]);
    }
    let out = 0;
    for (let holeIndex = 0; holeIndex < holes.length; holeIndex += 1) {
        while (holes[holeIndex].length > 0) {
            const previous = array[out];
            const nextValue = holes[holeIndex].shift();
            array[out] = nextValue;
            emitArray(array, name, [previous, nextValue]);
            out += 1;
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

function introSort(array, name) {
    const INSERTION_THRESHOLD = 16;
    const maxDepth = Math.max(1, 2 * Math.floor(Math.log2(Math.max(array.length, 2))));

    function insertionRange(left, right) {
        for (let i = left + 1; i <= right; i += 1) {
            let j = i;
            while (j > left && array[j - 1] > array[j]) {
                swap(array, j - 1, j, name);
                j -= 1;
            }
        }
    }

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

    function heapRange(low, high) {
        const segment = array.slice(low, high + 1);
        heapSortV2(segment, name);
        for (let i = 0; i < segment.length; i += 1) {
            const index = low + i;
            const previous = array[index];
            array[index] = segment[i];
            emitArray(array, name, [previous, segment[i]]);
        }
    }

    function sort(low, high, depthLimit) {
        if (low >= high) {
            return;
        }
        const size = (high - low) + 1;
        if (size <= INSERTION_THRESHOLD) {
            insertionRange(low, high);
            return;
        }
        if (depthLimit <= 0) {
            heapRange(low, high);
            return;
        }
        const pivotIndex = partition(low, high);
        sort(low, pivotIndex - 1, depthLimit - 1);
        sort(pivotIndex + 1, high, depthLimit - 1);
    }

    sort(0, array.length - 1, maxDepth);
    return array;
}


function flashSort(array, name) {
    const n = array.length;
    if (n <= 1) {
        return array;
    }

    let min = array[0];
    let max = array[0];
    let maxIndex = 0;
    for (let i = 1; i < n; i += 1) {
        if (array[i] < min) {
            min = array[i];
        }
        if (array[i] > max) {
            max = array[i];
            maxIndex = i;
        }
    }
    if (min === max) {
        return array;
    }

    const m = Math.max(2, Math.floor(0.43 * n));
    const classCounts = new Array(m).fill(0);
    const c1 = (m - 1) / (max - min);
    const classIndex = (value) => Math.min(m - 1, Math.floor(c1 * (value - min)));

    for (let i = 0; i < n; i += 1) {
        classCounts[classIndex(array[i])] += 1;
    }
    for (let i = 1; i < m; i += 1) {
        classCounts[i] += classCounts[i - 1];
    }

    swap(array, maxIndex, 0, name);

    let moves = 0;
    let j = 0;
    let k = m - 1;
    while (moves < n - 1) {
        while (j > classCounts[k] - 1) {
            j += 1;
            if (j >= n) {
                break;
            }
            k = classIndex(array[j]);
        }
        if (j >= n) {
            break;
        }

        let flash = array[j];
        while (j <= classCounts[k] - 1) {
            k = classIndex(flash);
            const destination = classCounts[k] - 1;
            const displaced = array[destination];
            const previous = array[destination];
            array[destination] = flash;
            emitArray(array, name, [previous, flash]);
            flash = displaced;
            classCounts[k] -= 1;
            moves += 1;
        }
    }

    for (let i = 1; i < n; i += 1) {
        let current = i;
        while (current > 0 && array[current - 1] > array[current]) {
            swap(array, current - 1, current, name);
            current -= 1;
        }
    }
    return array;
}

function beadSort(array, name) {
    if (array.length <= 1) {
        return array;
    }
    for (let i = 0; i < array.length; i += 1) {
        if (!Number.isFinite(array[i]) || !Number.isInteger(array[i])) {
            throw new Error("BeadSort requires integer values");
        }
    }

    const min = Math.min(...array);
    const shifted = array.map((value) => value - min);
    const max = Math.max(...shifted);
    if (max === 0) {
        return array;
    }

    const beads = Array.from({length: shifted.length}, () => new Array(max).fill(0));
    for (let row = 0; row < shifted.length; row += 1) {
        for (let col = 0; col < shifted[row]; col += 1) {
            beads[row][col] = 1;
        }
    }

    for (let col = 0; col < max; col += 1) {
        let sum = 0;
        for (let row = 0; row < shifted.length; row += 1) {
            sum += beads[row][col];
            beads[row][col] = 0;
        }
        for (let row = shifted.length - sum; row < shifted.length; row += 1) {
            beads[row][col] = 1;
        }
    }

    for (let row = 0; row < shifted.length; row += 1) {
        let count = 0;
        for (let col = 0; col < max; col += 1) {
            count += beads[row][col];
        }
        const previous = array[row];
        const nextValue = count + min;
        array[row] = nextValue;
        emitArray(array, name, [previous, nextValue]);
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

const BUILTIN_ALGORITHMS = [
    {id: "bubble", label: "BubbleSort", runner: bubbleSort},
    {id: "selection", label: "SelectionSort", runner: selectionSort},
    {id: "insertion", label: "InsertionSort", runner: insertionSort},
    {id: "shell", label: "ShellSort", runner: shellSort},
    {id: "gnome", label: "GnomeSort", runner: gnomeSort},
    {id: "quick", label: "QuickSort", runner: quickSort},
    {id: "merge", label: "MergeSort", runner: mergeSort},
    {id: "heap", label: "HeapSort", runner: heapSort},
    {id: "heapv2", label: "HeapSortV2", runner: heapSortV2},
    {id: "oddeven", label: "OddEvenSort", runner: oddEvenSort},
    {id: "cocktail", label: "CocktailShakerSort", runner: cocktailSort},
    {id: "comb", label: "CombSort", runner: combSort},
    {id: "counting", label: "CountingSort", runner: countingLikeSort},
    {id: "bucket", label: "BucketSort", runner: bucketSort},
    {id: "cycle", label: "CycleSort", runner: cycleSort},
    {id: "radix", label: "RadixSort", runner: radixSort},
    {id: "pigeonhole", label: "PigeonHoleSort", runner: pigeonholeSort},
    {id: "flash", label: "FlashSort", runner: flashSort},
    {id: "intro", label: "IntroSort", runner: introSort},
    {id: "tim", label: "TimSort", runner: timSort},
    {id: "bead", label: "BeadSort", runner: beadSort},
    {id: "bogo", label: "BogoSort", runner: bogoSort}
];

const BUILTIN_BY_ID = new Map(BUILTIN_ALGORITHMS.map((entry) => [entry.id, entry]));

function runBuiltInSort(algorithm, originalArray) {
    const selected = BUILTIN_BY_ID.get(algorithm);
    if (!selected) {
        throw new Error("Unsupported algorithm: " + algorithm);
    }
    const array = [...originalArray];
    return selected.runner(array, selected.label);
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
        const sorted = runBuiltInSort(algorithm, input);
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
