<script>
  import { onMount } from "svelte";
  import dateKeywords from "$lib/data/dates_keywords.json";
  import TitleBanner from "$lib/components/TitleBanner.svelte";
  import { bibleData, fetchBibleData } from "$lib/bibleDataStore";
  import {
    completeBible,
    fetchCompleteBibleData,
  } from "$lib/completeBibleStore";

  let searchNumber = "";
  let searchKeyword = "";
  let allVerses = [];
  let groupedVerses = {};
  let openBook = null;
  let totalVersesCount = 0;

  onMount(() => {
    fetchBibleData();
    fetchCompleteBibleData();
  });

  $: {
    if ($bibleData && $completeBible) {
      allVerses = [
        ...$bibleData.flatMap((book) => book.verses_with_numbers || []),
        ...$completeBible,
      ];
      groupedVerses = groupAndFilterVerses(
        searchNumber,
        searchKeyword,
        allVerses
      );
      openBook = null; // Reset the open book
      totalVersesCount = calculateTotalVerses(groupedVerses);
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
    return groupVerses(
      verses.filter(
        (verse) =>
          (!number.trim() || verse.text.includes(number)) &&
          (!keyword.trim() || verse.text.includes(keyword))
      )
    );
  }

  function setKeywordFilter(keyword) {
    searchKeyword = keyword;
  }

  function clearSearch() {
    searchNumber = "";
    searchKeyword = "";
    openBook = null;
  }

  function toggleBook(book) {
    openBook = openBook === book ? null : book;
  }

  function calculateTotalVerses(grouped) {
    return Object.values(grouped).reduce(
      (total, verses) => total + verses.length,
      0
    );
  }
</script>

<!-- HTML Template -->
<div class="m-4">
  <TitleBanner
    secondTitle="Dates in Bible Verses"
    thirdTitle="It's Praise JESUS Let's Gooooo"
  />

  <!-- Date Keyword Filter Buttons -->

  <div class="card bg-slate-800 pt-4 pb-0 pl-2 my-2">
    <p class="mb-2 font-bold">Day/Date/Time Filters</p>
    <div class="flex flex-wrap gap-2 mb-4">
      {#each dateKeywords.keywords as keyword}
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
  </div>

  <!-- Month Filter Buttons -->
  <div class="card bg-slate-800 pt-4 pb-0 pl-2 my-2">
    <p class="mb-2 font-bold">Jewish Month Filters</p>

    <div class="flex flex-wrap gap-2 mb-4">
      {#each dateKeywords.months as month}
        <button
          class={`btn ${
            searchKeyword === month ? "btn-success" : "btn-primary"
          }`}
          on:click={() => setKeywordFilter(month)}
        >
          {month}
        </button>
      {/each}
    </div>
  </div>

  <!-- Search Input and Clear Button -->
  <div class="flex gap-2">
    <input
      class="w-full p-2 border-2 border-gray-300 rounded-lg"
      type="text"
      placeholder="Enter a number to search within date verses..."
      bind:value={searchNumber}
    />
    <button class="btn btn-error" on:click={clearSearch}>Clear</button>
  </div>

  <!-- Total Verses Count Display -->
  <div class="text-lg font-bold">
    Total Verses Found: {totalVersesCount}
  </div>

  <!-- Display Grouped Verses with Styled Accordion Feature -->
  {#each Object.entries(groupedVerses) as [book, verses]}
    <div class="my-4">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <h2
        class="rounded-lg p-2 font-extrabold bg-success text-slate-900 text-xl text-center cursor-pointer"
        on:click={() => toggleBook(book)}
      >
        {book}
        <span class="ml-2 bg-green-900 text-slate-100 shadow-md rounded-lg p-1"
          >({verses.length}) Verses</span
        >
      </h2>
      {#if openBook === book}
        <div class="mt-2">
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
