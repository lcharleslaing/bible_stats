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
    const response = await fetch("/Transcript.json");
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
  imageUrl="/koolcat7729.jpg"
  secondTitle="KOOLCAT7729 Video Studies"
  thirdTitle="PTERODACTYL Rides Anyone!!!!"
  para="If you wanna get inside the head of a PTERODACTYL riding, SHED jumping NEPHILIM, then start your typing engines and get ready to take some notes. PRAISE GOD LET'S GO!  Get some BAM BISCUITS you SUM GUM!!"
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
