<script>
  import PatternsNavbar from "$lib/components/PatternsNavbar.svelte";
  import bibleSequences from "$lib/data/bible_sequences.json";
  import TitleBanner from "$lib/components/TitleBanner.svelte";

  let searchPattern = "";
  let filteredPatterns = {};

  // Reactive statement to update filtered patterns
  $: {
    const searchNumbers = searchPattern
      .trim()
      .split(" ")
      .map(Number)
      .filter((n) => !isNaN(n));
    console.log("Search Numbers:", searchNumbers); // Debugging
    filteredPatterns =
      searchPattern.trim() === ""
        ? aggregatePatterns(bibleSequences)
        : filterPatterns(searchNumbers);
  }

  function startsWithSequence(patternString, sequence) {
    const pattern = patternString.split(",").map(Number);
    if (sequence.length > pattern.length) return false;
    for (let i = 0; i < sequence.length; i++) {
      if (pattern[i] !== sequence[i]) return false;
    }
    return true;
  }

  function filterPatterns(searchNumbers) {
    const filtered = {};
    Object.entries(aggregatePatterns(bibleSequences)).forEach(
      ([count, books]) => {
        Object.entries(books).forEach(([book, patterns]) => {
          const matchingPatterns = patterns.filter((patternString) =>
            startsWithSequence(patternString, searchNumbers)
          );
          if (matchingPatterns.length > 0) {
            if (!filtered[count]) filtered[count] = {};
            filtered[count][book] = matchingPatterns;
          }
        });
      }
    );
    return filtered;
  }

  // Function to aggregate patterns by count and then by book
  function aggregatePatterns(bibleData) {
    const groupedByCount = {};
    Object.entries(bibleData.books).forEach(([book, bookPatterns]) => {
      Object.entries(bookPatterns).forEach(([pattern, count]) => {
        if (!groupedByCount[count]) {
          groupedByCount[count] = {};
        }
        if (!groupedByCount[count][book]) {
          groupedByCount[count][book] = [];
        }
        groupedByCount[count][book].push(pattern);
      });
    });
    return groupedByCount;
  }

  const groupedPatterns = aggregatePatterns(bibleSequences);

  let openCount = null; // State for count accordion
  let openBook = null; // State for book accordion within a count

  // Function to toggle accordion sections for counts
  function toggleCount(count) {
    if (openCount === count) {
      openCount = null;
      openBook = null; // Reset book accordion when closing count accordion
    } else {
      openCount = count;
      openBook = null; // Reset book accordion when opening a different count accordion
    }
  }

  function clearSearchAndCloseAccordions() {
    searchPattern = "";
    openCount = null;
    openBook = null;
  }

  // Function to toggle accordion sections for books within a count
  function toggleBook(book) {
    openBook = openBook === book ? null : book;
  }
</script>

<PatternsNavbar />

<TitleBanner
  secondTitle="Number Patterns By BOOKS"
  thirdTitle="It's Praise JESUS Let's Gooooo"
/>

<!-- Search Input with Clear Button -->
<div class="text-center my-4 flex justify-center items-center gap-2">
  <input
    type="text"
    class="input input-bordered"
    placeholder="Enter patterns (e.g., 1 3 7)"
    bind:value={searchPattern}
  />
  <button class="btn btn-error" on:click={clearSearchAndCloseAccordions}>
    Clear
  </button>
</div>

<!-- Display Grouped Patterns by Count, then by Book -->
<div class="p-4">
  <h1 class="text-center text-lg">
    Click the <strong>Buttons</strong> below to open the
    <strong>Section</strong>
    to view the <strong>Books</strong> within each
    <strong>Count</strong>
  </h1>
  {#each Object.entries(filteredPatterns) as [count, books]}
    <div class="my-2">
      <!-- Count Accordion Toggle -->
      <h2
        class="text-4xl p-2 bg-success text-slate-900 text-center rounded-lg font-bold my-4 cursor-pointer"
        on:click={() => toggleCount(count)}
      >
        {count}x (Book)
      </h2>

      {#if openCount === count}
        {#each Object.entries(books) as [book, patterns]}
          <div class="my-2">
            <!-- Book Accordion Toggle -->
            <div
              class="flex card p-2 bg-primary text-slate-900 rounded-lg mb-4 cursor-pointer"
              on:click={() => toggleBook(book)}
            >
              <div class="text-2xl text-center font-extrabold">
                {book} ({count}x)
              </div>
            </div>

            <!-- Display Patterns if Book is Selected -->
            {#if openBook === book}
              <div class="flex flex-row flex-wrap justify-start gap-2 mb-4">
                {#each patterns as pattern}
                  <button class="btn bg-slate-200 text-black font-bold">
                    {pattern}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  {/each}
</div>
