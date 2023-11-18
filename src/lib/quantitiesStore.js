import { writable, derived } from 'svelte/store';

// Store for the raw Bible data
export const rawQuantitiesStore = writable([]);

// Asynchronously load and process Bible data for quantities
export async function loadQuantitiesData() {
    const response = await fetch('/bible_data.json');
    const data = await response.json();
    rawQuantitiesStore.set(data);
}

// Store for unique numbers and their occurrences
export const uniqueNumbersStore = derived(rawQuantitiesStore, $rawQuantitiesStore => {
    let uniqueNumbers = new Set();
    let numberOccurrences = {};

    if ($rawQuantitiesStore.length > 0) {
        $rawQuantitiesStore.forEach(book => {
            book.sequences.forEach(number => {
                uniqueNumbers.add(number);
                numberOccurrences[number] = (numberOccurrences[number] || 0) + 1;
            });
        });
    }

    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);

    return {
        sortedNumbers: sortedNumbers,
        numberOccurrences: numberOccurrences
    };
});
