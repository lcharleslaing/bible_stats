// src/lib/bibleStore.js
import { writable } from 'svelte/store';

export const bibleStore = writable(null);

export async function loadBibleData() {
    const response = await fetch('/bible_data.json');
    const data = await response.json();

    // Transform the object into an array
    const dataArray = Object.values(data);

    // Update the store with the transformed data
    bibleStore.set(dataArray);
}

