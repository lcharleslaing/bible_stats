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

  const aggregatedPatterns = aggregateBiblePatterns(bibleSequences);
  const groupedPatterns = groupPatternsByCount(aggregatedPatterns);

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
<!-- Display Grouped Patterns for the entire Bible -->
<div class="p-4">
  <h1 class="text-center text-lg text-center">
    Click the <strong>Buttons</strong> below to open the
    <strong>Section</strong>
    to view the <strong>Books</strong> within each
    <strong>Count</strong>
  </h1>
  {#each Object.entries(groupedPatterns) as [count, patterns]}
    <div class="my-2">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
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
