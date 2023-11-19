<script>
  import PatternsNavbar from "$lib/components/PatternsNavbar.svelte";
  import bibleSequences from "$lib/data/bible_sequences.json";
  import TitleBanner from "$lib/components/TitleBanner.svelte";

  // Function to aggregate overall patterns from the Bible
  function aggregateBiblePatterns(bibleData) {
    const allPatterns = {};
    Object.values(bibleData.books).forEach((bookPatterns) => {
      Object.entries(bookPatterns).forEach(([pattern, count]) => {
        if (!allPatterns[pattern]) {
          allPatterns[pattern] = 0;
        }
        allPatterns[pattern] += count;
      });
    });
    return allPatterns;
  }

  function clearSearchAndCloseAccordions() {
    searchPattern = "";
    openGroup = null;
    openBook = null; // Add this line if you have book-level accordions
  }

  // Function to group patterns by count
  function groupPatternsByCount(aggregatedPatterns) {
    const grouped = {};
    Object.entries(aggregatedPatterns).forEach(([pattern, count]) => {
      if (!grouped[count]) {
        grouped[count] = [];
      }
      grouped[count].push(pattern);
    });
    return grouped;
  }

  const aggregatedPatterns = groupPatternsByCount(
    aggregateBiblePatterns(bibleSequences)
  );

  let searchPattern = "";
  let filteredPatterns = aggregatedPatterns; // Initialize with all patterns

  $: {
    const searchNumbers = searchPattern
      .trim()
      .split(" ")
      .map(Number)
      .filter((n) => !isNaN(n));
    filteredPatterns =
      searchPattern.trim() === ""
        ? aggregatedPatterns
        : filterBiblePatterns(searchNumbers);
  }

  function startsWithSequence(patternString, sequence) {
    const pattern = patternString.split(",").map(Number);
    return sequence.every((num, index) => pattern[index] === num);
  }

  function filterBiblePatterns(searchNumbers) {
    const filtered = {};
    Object.entries(aggregatedPatterns).forEach(([count, patterns]) => {
      const matchingPatterns = patterns.filter((patternString) =>
        startsWithSequence(patternString, searchNumbers)
      );
      if (matchingPatterns.length > 0) {
        filtered[count] = matchingPatterns;
      }
    });
    return filtered;
  }

  // State management for accordion
  let openGroup = null;

  // Function to toggle accordion sections
  function toggleGroup(count) {
    openGroup = openGroup === count ? null : count;
  }
</script>

<PatternsNavbar />
<TitleBanner
  secondTitle="Number Patterns in the BIBLE"
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

<!-- Display Grouped Patterns for the entire Bible -->
<div class="p-4">
  <h1 class="text-center text-lg">
    Click the <strong>Buttons</strong> below to view patterns.
  </h1>
  {#each Object.entries(filteredPatterns) as [count, patterns]}
    <div class="my-2">
      <h2
        class="text-4xl p-2 bg-success text-slate-900 text-center rounded-lg font-bold my-4 cursor-pointer"
        on:click={() => toggleGroup(count)}
      >
        {count}x (Bible)
      </h2>
      {#if openGroup === count}
        <ul class="flex flex-row flex-wrap justify-start gap-2">
          {#each patterns as pattern}
            <li
              class="card rounded-lg p-2 bg-slate-300 font-bold text-slate-900"
            >
              {pattern}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/each}
</div>
