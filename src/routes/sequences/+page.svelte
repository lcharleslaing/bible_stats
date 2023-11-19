<script>
  import { writable, derived } from "svelte/store";
  import { sequencesStore } from "$lib/sequencesStore.js";
  import { onMount } from "svelte";

  let isAccordionOpen = false;
  const visibleBook = writable(null); // Store to track the visible book

  // Derived store to filter books based on the visible book
  const filteredBooks = derived(
    [sequencesStore, visibleBook],
    ([$sequencesStore, $visibleBook]) => {
      return $visibleBook
        ? $sequencesStore.books.filter((book) => book.name === $visibleBook)
        : $sequencesStore.books;
    }
  );

  onMount(async () => {
    await sequencesStore.loadAllData();
  });

  function showAllBooks() {
    visibleBook.set(null);
    isAccordionOpen = false;
  }

  function showOnlyBook(bookName) {
    visibleBook.set(bookName);
    isAccordionOpen = false;
  }

  function getNumberCounts(bookName) {
    return sequencesStore.getNumberCounts(bookName) || {};
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

  function handleFilterByCount(count, bookName) {
    // Logic to handle filter by count
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

  <button class="btn btn-sm btn-primary my-2" on:click={toggleAccordion}>
    {isAccordionOpen ? "Hide Books" : "Show Books"}
  </button>

  {#if isAccordionOpen}
    <div class="grid grid-cols-4 space-y-1 justify-center items-center">
      <button class="btn btn-sm btn-primary" on:click={showAllBooks}>All</button
      >
      {#each $filteredBooks as book (book.name)}
        <button
          class="btn btn-sm btn-primary mx-1"
          on:click={() => showOnlyBook(book.name)}
        >
          {truncate(book.name)}
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

        <div class="grid grid-cols-2 gap-0.5 mt-3">
          {#each Object.entries(groupNumbersByOccurrences(book.name)) as [count, numbers]}
            <div>
              <button
                class="btn btn-sm btn-outline btn-primary w-20 text-lg my-1"
                on:click={() => handleFilterByCount(count, book.name)}
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
</div>
