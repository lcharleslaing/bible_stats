import { writable } from 'svelte/store';

export const bibleStore = writable([]);

export async function loadBibleData() {
    const response = await fetch('/bible_data.json');
    const data = await response.json();
    bibleStore.set(data);
}