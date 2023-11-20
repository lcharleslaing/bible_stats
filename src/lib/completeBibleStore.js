// src/lib/stores/completeBibleStore.js
import { writable } from 'svelte/store';

export const completeBible = writable([]);

export async function fetchCompleteBibleData() {
    try {
        const response = await fetch('data/KJV1769Bible_Cleaned.json'); // Adjust the path
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        completeBible.set(data);
    } catch (error) {
        console.error('Error fetching complete bible data:', error);
    }
}
