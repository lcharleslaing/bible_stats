<script>
  import PatternsNavbar from "$lib/components/PatternsNavbar.svelte";
  import bibleSequences from "$lib/data/bible_sequences.json";
  import TitleBanner from "$lib/components/TitleBanner.svelte";

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

<!-- Display Grouped Patterns by Count, then by Book -->
<div class="p-4">
  <h1 class="text-center text-lg text-center">
    Click the <strong>Buttons</strong> below to open the
    <strong>Section</strong>
    to view the <strong>Books</strong> within each
    <strong>Count</strong>
  </h1>
  {#each Object.entries(groupedPatterns) as [count, books]}
    <div class="my-2">
      <!-- Count Accordion Toggle -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
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
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
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
