<script>
  import { writable, derived } from "svelte/store";
  import { sequencesStore } from "$lib/sequencesStore.js";
  import { onMount } from "svelte";

  let isAccordionOpen = false;
  let sequencesData = {
    books: [],
    sequencesByBook: new Map(),
    numberCountsByBook: new Map(),
  };

  const visibleBook = writable(null); // Store to track the visible book

  onMount(async () => {
    await sequencesStore.loadMoreData(); // Call loadMoreData instead of loadSequencesData
    sequencesStore.subscribe((data) => {
      sequencesData = data;
    });
  });

  const filteredBooks = derived(
    [sequencesStore, visibleBook],
    ([$sequencesStore, $visibleBook]) =>
      $visibleBook
        ? $sequencesStore.books.filter((book) => book.name === $visibleBook)
        : $sequencesStore.books
  );

  function showAllBooks() {
    visibleBook.set(null);
    isAccordionOpen = false;
  }

  function showOnlyBook(bookName) {
    visibleBook.set(bookName);
    isAccordionOpen = false;
  }

  function getNumberCounts(bookName) {
    return sequencesData.numberCountsByBook.get(bookName) || {};
  }

  function groupNumbersByOccurrences(bookName) {
    const counts = getNumberCounts(bookName);
    const grouped = {};
    Object.entries(counts).forEach(([number, count]) => {
      if (!grouped[count]) {
        grouped[count] = [];
      }
      grouped[count].push(number);
    });
    return grouped;
  }

  function handleFilterByCount(count) {
    // Implement the logic to filter verses based on the 'selectedCount'
    // Update your display logic here
  }
  // Infinite scrolling logic
  function onScroll(node) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          sequencesStore.loadMoreData();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.unobserve(node);
      },
    };
  }

  function truncate(text) {
    return text.slice(0, 5);
  }

  function toggleAccordion() {
    isAccordionOpen = !isAccordionOpen;
  }
</script>

<div class="m-6">
  <h1 class="text-2xl text-center font-extrabold">The Chosen Few</h1>
  <h1 class="text-2xl text-center">KJV Bible Number Sequences</h1>
  <h1 class="text-2xl text-center font-extrabold">Praise GOD Let's Goooo!!!</h1>

  <!-- Accordion Toggle Button -->
  <button
    class="btn btn-sm btn-primary my-2"
    on:click={() => (isAccordionOpen = !isAccordionOpen)}
  >
    {isAccordionOpen ? "Hide Books" : "Show Books"}
  </button>

  <!-- Accordion Content: Book Buttons -->
  {#if isAccordionOpen}
    <div class="grid grid-cols-4 space-y-1 justify-center items-center">
      <button class="btn btn-sm btn-primary" on:click={showAllBooks}>All</button
      >
      {#each $filteredBooks as book (book.name)}
        <button
          class="btn btn-sm btn-primary mx-1"
          on:click={() => showOnlyBook(book.name)}
        >
          {book.name}
        </button>
      {/each}
    </div>
  {/if}

  {#each $filteredBooks as book (book.name)}
    <div class="my-4">
      <div class="bg-white shadow-lg rounded-lg p-4 my-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-bold text-blue-600">Number Counts in:</h3>
          <h3 class="text-lg font-bold text-blue-600">{book.name}</h3>
        </div>

        <div class="grid grid-cols-4 gap-1 mt-3">
          {#each Object.entries(groupNumbersByOccurrences(book.name)) as [count, numbers]}
            <div>
              <button
                class="btn btn-sm btn-outline btn-primary w-20 text-lg my-2"
                on:click={() => handleFilterByCount(count)}
              >
                {count}x
              </button>
              <div class="ml-4 pl-4 border-l-2 border-gray-200">
                {#each numbers as number}
                  <span class="badge badge-accent text-white text-lg mr-2"
                    >{number}</span
                  >
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Verse Sequences Display (if needed) -->
    </div>
  {/each}

  <!-- Sentinel element for infinite scrolling -->
  <div use:onScroll class="loading-sentinel" />
</div>

<!-- {#each book.verses_with_numbers as verse}
        {#if verse.numeric_numbers.length > 1}
          <div class="card bg-slate-300 px-4 py-2 text-slate-900 my-2">
            <strong>{verse.book} {verse.chapter}:{verse.verse}</strong>
            <div class="flex flex-row justify-between">
              <div class="">
                <p>Verse Sequence:</p>
                <span
                  class="card p-4 bg-slate-700 text-center text-white text-lg font-bold my-2"
                >
                  {verse.numeric_numbers.join(", ")}
                </span>
              </div>
              <div class="">
                <p>Sum of Sequence:</p>
                <span
                  class="card p-4 bg-slate-700 text-white text-center text-lg font-bold my-2"
                >
                  {sumOfSequence(verse.numeric_numbers)}
                </span>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/each}

  Sentinel element for infinite scrolling
  <div use:onScroll class="loading-sentinel" />
</div> -->
