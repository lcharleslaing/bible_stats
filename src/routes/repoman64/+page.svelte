<script>
  import { writable, derived } from "svelte/store";
  import { onMount } from "svelte";
  import { groupedTranscripts, groupByVideoId } from "$lib/transcriptStore.js";
  import TitleBanner from "$lib/components/TitleBanner.svelte";

  const maxVideoIds = 20;
  const searchText = writable("");
  let timeoutId;

  function debounce(func, delay) {
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const updateSearchText = debounce((value) => searchText.set(value), 2000);

  const filteredTranscripts = derived(
    [groupedTranscripts, searchText],
    ([$groupedTranscripts, $searchText]) => {
      const filtered = {};
      if ($searchText.trim()) {
        for (const videoId in $groupedTranscripts) {
          const matches = $groupedTranscripts[videoId].filter((transcript) =>
            transcript.text.toLowerCase().includes($searchText.toLowerCase())
          );
          if (matches.length > 0) {
            filtered[videoId] = matches;
          }
        }
      }
      return filtered;
    }
  );

  onMount(async () => {
    const response = await fetch("/TranscriptMike.json");
    const data = await response.json();
    let grouped = groupByVideoId(data);
    groupedTranscripts.set(grouped);
  });

  function openVideoAtTimestamp(videoId, startTime) {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}&t=${startTime}s`;
    window.open(videoUrl, "_blank");
  }

  function formatTime(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    // Using 'substring' instead of 'substr'
    return date.toISOString().substring(11, 19);
  }
</script>

<TitleBanner
  imageUrl="/repoman64.jpg"
  secondTitle="REPOMAN64 Video Studies"
  thirdTitle="My TIMELINE Sheckles!!!!"
  para="If you wanna get inside the head of a GENIUS MASTERMIND OF THE TIMELINE and a SHECKLE COMMANDING AUTHORITY, then start your typing engines and get ready to take some notes. GO TO A QUIET PLACE, BY YOURSELF, NOBODY NEEDS TO KNOW AND YOU DON'T NEED TO TELL ANYBODY...ACCEPT THE LORD INTO YOUR HEART...Matthew 6:5-6...THEN TELL EVERYONE!!!!"
/>

<label class="label" for="searchInput">
  <span class="label-text">Search Transcripts</span>
</label>
<div class="m-2">
  <input
    id="searchInput"
    type="text"
    class="input input-bordered w-full"
    placeholder="Type to search..."
    on:input={(e) => updateSearchText(e.target.value)}
  />
</div>

{#each Object.entries($filteredTranscripts) as [videoId, transcripts]}
  {#if transcripts.length > 0}
    <div class="accordion m-2">
      {#each transcripts as transcript}
        <div
          class="p-2 border-b border-gray-200 flex justify-between items-center"
        >
          <p class="flex flex-row items-center">
            {transcript.text}
            {#if "start" in transcript}
              <strong class="badge badge-primary mr-2 ml-2">
                {formatTime(transcript.start)}</strong
              >
            {:else}
              <strong>Start Time Not Available</strong>
            {/if}
          </p>
          <button
            class="btn btn-sm btn-secondary"
            on:click={() =>
              openVideoAtTimestamp(
                videoId,
                parseInt(transcript.start || 0, 10)
              )}
          >
            Open Video
          </button>
        </div>
      {/each}
    </div>
  {/if}
{/each}
