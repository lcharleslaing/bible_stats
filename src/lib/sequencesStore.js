// sequencesStore.js
import { writable } from 'svelte/store';

function createSequencesStore() {
    const { subscribe, set, update } = writable({ books: [], sequencesByBook: new Map(), numberCountsByBook: new Map(), loadedPages: 0 });

    async function loadMoreData(pageSize = 10) {
        try {
            const response = await fetch('/bible_data.json'); // Update with the correct path
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const booksData = await response.json();

            update(data => {
                const startIndex = data.loadedPages * pageSize;
                const endIndex = startIndex + pageSize;
                const newBooks = booksData.slice(startIndex, endIndex);

                newBooks.forEach(book => {
                    data.sequencesByBook.set(book.name, new Set(book.sequences || []));
                    data.numberCountsByBook.set(book.name, book.number_counts || {});
                });

                return {
                    ...data,
                    books: [...data.books, ...newBooks],
                    loadedPages: data.loadedPages + 1
                };
            });
        } catch (error) {
            console.error("Error loading more data:", error);
        }
    }

    return {
        subscribe,
        loadMoreData, // Make sure this function is correctly exported
    };
}

export const sequencesStore = createSequencesStore();