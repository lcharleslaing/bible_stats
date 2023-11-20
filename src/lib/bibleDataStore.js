// src/lib/stores/bibleDataStore.js
import { writable } from 'svelte/store';

export const bibleData = writable([]);

export async function fetchBibleData() {
    try {
        const response = await fetch('/bible_data.json'); // Adjust path
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        bibleData.set(data); // Assuming data is directly the array of verses
    } catch (error) {
        console.error('Error fetching bible data:', error);
    }
}
