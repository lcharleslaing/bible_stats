// src/lib/transcriptStore.js
import { writable } from 'svelte/store';

export const groupedTranscripts = writable({});

export function groupByVideoId(transcripts) {
    return transcripts.reduce((acc, transcript) => {
        acc[transcript.video_id] = acc[transcript.video_id] || [];
        acc[transcript.video_id].push(transcript);
        return acc;
    }, {});
}
