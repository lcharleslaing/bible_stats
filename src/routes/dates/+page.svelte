<script>
  import { onMount } from "svelte";
  import dateKeywords from "$lib/data/dates_keywords.json";
  import TitleBanner from "$lib/components/TitleBanner.svelte";
  import { bibleData, fetchBibleData } from "$lib/bibleDataStore";

  // Declare and initialize variables
  let searchNumber = "";
  let allVerses = [];
  let versesWithKeywords = [];
  let filteredVerses = [];

  onMount(() => {
    fetchBibleData(); // Fetch the data when the component mounts
  });

  $: {
    if ($bibleData && $bibleData.length > 0) {
      allVerses = $bibleData.flatMap((book) => book.verses_with_numbers);
      versesWithKeywords = filterVersesByKeywords(
        dateKeywords.keywords,
        allVerses
      );

      const searchNumbers = searchNumber
        .trim()
        .split(" ")
        .map(Number)
        .filter((n) => !isNaN(n));
      filteredVerses = searchNumber.trim()
        ? filterAndModifyVerses(
            searchNumbers,
            dateKeywords.keywords,
            versesWithKeywords
          )
        : versesWithKeywords;
    } else {
      allVerses = [];
      versesWithKeywords = [];
      filteredVerses = [];
    }
  }

  function filterVersesByKeywords(keywords, verses) {
    return verses.filter((verse) =>
      keywords.some((keyword) => verse.text.includes(keyword))
    );
  }

  function filterAndModifyVerses(numbers, keywords, verses) {
    return verses
      .map((verse) => {
        let modifiedText = verse.text;
        numbers.forEach((number) => {
          keywords.forEach((keyword) => {
            const regex = new RegExp(`\\b${number}(\\s+${keyword})\\b`, "gi");
            modifiedText = modifiedText.replace(
              regex,
              (match, keywordMatch) => {
                return `${number}<strong>${keywordMatch.toUpperCase()}</strong>`;
              }
            );
          });
        });
        return modifiedText !== verse.text
          ? { ...verse, text: modifiedText }
          : verse;
      })
      .filter((verse) =>
        numbers.some((number) => verse.text.includes(number.toString()))
      );
  }
</script>

<!-- UI for displaying filteredVerses and the search input -->
<div class="my-4">
  <TitleBanner
    secondTitle="Dates in Bible Verses"
    thirdTitle="It's Praise JESUS Let's Gooooo"
  />
</div>

<div class="m-4">
  <div class="flex gap-2">
    <input
      class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      id="searchNumber"
      type="text"
      placeholder="Enter a number to search within date verses..."
      bind:value={searchNumber}
    />

    <!-- Clear Button -->
    <button
      class="btn btn-error p-2 rounded-lg"
      on:click={() => (searchNumber = "")}
    >
      Clear
    </button>
  </div>

  <!-- Displaying the total number of verses -->
  <p class="card bg-slate-200 flex justify-between items-center text-xl my-4">
    <span class="float-left text-slate-900 font-bold">Date Verses Count:</span>
    <span
      class="float-right card p-4 mb-2 bg-slate-700 shadow-lg text-slate-100 font-bold"
      >{filteredVerses.length}</span
    >
  </p>

  <div class="">
    {#each filteredVerses as verse}
      <div class="my-2 card bg-slate-100 text-slate-900 p-2">
        <strong>{verse.book} {verse.chapter}:{verse.verse}</strong>
        <p>{@html verse.text}</p>
        <!-- Render modified text as HTML -->
      </div>
    {/each}
  </div>
</div>
