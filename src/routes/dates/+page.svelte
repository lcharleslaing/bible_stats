<script>
  import { onMount } from "svelte";
  import dateKeywords from "$lib/data/dates_keywords.json";
  import TitleBanner from "$lib/components/TitleBanner.svelte";
  import { bibleData, fetchBibleData } from "$lib/bibleDataStore";

  let searchNumber = "";
  let searchKeyword = ""; // Store the current keyword
  let allVerses = [];
  let groupedVerses = {};
  let openBook = null;

  onMount(() => {
    fetchBibleData();
  });

  // Singular keywords (without plurals) from the JSON file
  let keywords = dateKeywords.keywords;

  $: {
    if ($bibleData && $bibleData.length > 0) {
      allVerses = $bibleData.flatMap((book) => book.verses_with_numbers);
      groupedVerses = groupAndFilterVerses(
        searchNumber,
        searchKeyword,
        allVerses
      );
      openBook = null; // Close all accordions when filter changes
    } else {
      allVerses = [];
      groupedVerses = {};
      openBook = null; // Close all accordions if there are no data
    }
  }

  function groupVerses(verses) {
    return verses.reduce((acc, verse) => {
      if (!acc[verse.book]) acc[verse.book] = [];
      acc[verse.book].push(verse);
      return acc;
    }, {});
  }

  function groupAndFilterVerses(number, keyword, verses) {
    let filtered = verses.filter((verse) => {
      const numberMatch = number.trim() ? verse.text.includes(number) : true;
      const keywordMatch = keyword.trim() ? verse.text.includes(keyword) : true;
      return numberMatch && keywordMatch;
    });
    return groupVerses(filtered);
  }

  function setKeywordFilter(keyword) {
    searchKeyword = keyword;
    groupedVerses = groupAndFilterVerses(
      searchNumber,
      searchKeyword,
      allVerses
    );
    openBook = null; // Close all accordions when filter changes
  }

  function filterVersesByKeyword(keyword, verses) {
    // Search for both singular and plural forms of the keyword
    const pluralKeyword = keyword + "s"; // Assuming plural is just 's' added
    return verses.filter(
      (verse) =>
        verse.text.includes(keyword) || verse.text.includes(pluralKeyword)
    );
  }

  function clearSearch() {
    searchNumber = "";
    searchKeyword = "";
    openBook = null; // Close all accordions on clear
  }

  function toggleBook(book) {
    openBook = openBook === book ? null : book; // Toggle the open book
  }
</script>

<div class="m-4">
  <TitleBanner
    secondTitle="Dates in Bible Verses"
    thirdTitle="It's Praise JESUS Let's Gooooo"
  />

  <!-- Keyword Filter Buttons -->
  <p class="text-lg font-bold text-green-700">Filter Buttons...</p>
  <div class="flex flex-wrap gap-2 mb-4">
    {#each keywords as keyword}
      <button
        class={`btn ${
          searchKeyword === keyword ? "btn-success" : "btn-primary"
        }`}
        on:click={() => setKeywordFilter(keyword)}
      >
        {keyword}(s)
      </button>
    {/each}
  </div>

  <!-- Search and Clear -->
  <p class="text-lg font-bold text-green-700">Refine by Adding a Number...</p>

  <div class="flex gap-2">
    <input
      class="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      type="text"
      placeholder="Enter a number to search within date verses..."
      bind:value={searchNumber}
    />
    <button class="btn btn-error p-2 rounded-lg" on:click={clearSearch}>
      Clear
    </button>
  </div>

  <!-- Displaying Grouped Verses with Accordions and Counts -->
  {#each Object.entries(groupedVerses) as [book, verses]}
    <div class="my-4">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <h2
        class="rounded-lg p-2 font-extrabold bg-success text-slate-900 rouned-lg text-xl text-center font-bold cursor-pointer"
        on:click={() => toggleBook(book)}
      >
        {book}

        <span
          class="pb-1 font-normal px-2 pt-0 bg-green-900 text-slate-100 shadow-md rounded-lg"
          >({verses.length}) Verses</span
        >
      </h2>
      {#if openBook === book}
        <div class="">
          {#each verses as verse}
            <div class="my-2 card bg-slate-100 text-slate-900 p-2">
              <strong>{verse.book} {verse.chapter}:{verse.verse}</strong>
              <p>{@html verse.text}</p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>
