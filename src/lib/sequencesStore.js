// sequencesStore.js
import { writable } from 'svelte/store';

function createSequencesStore() {
    const { subscribe, set, update } = writable({ books: [], sequencesByBook: new Map(), numberCountsByBook: new Map() });

    async function loadAllData() {
        try {
            const response = await fetch('/bible_data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const booksData = await response.json();

            set({
                books: booksData,
                sequencesByBook: booksData.reduce((map, book) => {
                    map.set(book.name, new Set(book.sequences || []));
                    return map;
                }, new Map()),
                numberCountsByBook: booksData.reduce((map, book) => {
                    map.set(book.name, book.number_counts || {});
                    return map;
                }, new Map())
            });
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }

    // Function to get number counts
    function getNumberCounts(bookName) {
        let storeValue;
        subscribe((value) => {
            storeValue = value;
        })();
        return storeValue.numberCountsByBook.get(bookName) || {};
    }

    return {
        subscribe,
        loadAllData,
        getNumberCounts,
    };
}

export const sequencesStore = createSequencesStore();
