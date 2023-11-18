<script>
  import { bibleStore, loadBibleData } from "$lib/bibleStore";
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";

  const visibleBook = writable(null);
  const searchText = writable("");
  let isAccordionOpen = false; // State variable for accordion toggle

  function toggleAccordion() {
    isAccordionOpen = !isAccordionOpen;
  }
  const filteredVerses = derived(
    [bibleStore, searchText],
    ([$bibleStore, $searchText]) => {
      if (!$bibleStore) return [];
      if (!$searchText.trim()) return $bibleStore;

      const searchNumber = $searchText.trim();
      const searchRegEx = new RegExp(`\\b${searchNumber}\\b`, "g"); // This matches whole numbers

      return $bibleStore
        .flatMap((book) => ({
          ...book,
          verses_with_numbers: book.verses_with_numbers.filter((verse) =>
            searchRegEx.test(verse.text)
          ),
        }))
        .filter((book) => book.verses_with_numbers.length > 0);
    }
  );

  // A new derived store to keep track of the total number of filtered verses
  const totalFilteredVerses = derived(filteredVerses, ($filteredVerses) =>
    $filteredVerses.reduce(
      (total, book) => total + book.verses_with_numbers.length,
      0
    )
  );

  onMount(async () => {
    await loadBibleData(); // Ensure this is awaited if it's asynchronous
  });

  function showOnlyBook(bookName) {
    visibleBook.set(bookName);
    isAccordionOpen = false; // Close the accordion
  }
  function showAllBooks() {
    visibleBook.set(null);
  }

  function truncate(text) {
    return text.slice(0, 5);
  }

  import HelpModal from "$lib/components/HelpModal.svelte";
  let modalOpen = true;
  let openOnStart = true;

  function handleModalClose() {
    modalOpen = false;
  }

  function handleModalUpdate(event) {
    openOnStart = event.detail.openOnStart;
  }
</script>

<div class="m-6">
  <div class="my-4">
    <h1 class="text-2xl text-center font-extrabold">The Chosen Few</h1>
    <h1 class="text-2xl text-center">KJV Bible Verses with Numbers</h1>
    <h1 class="text-2xl text-center font-extrabold">It's a Bam Biscuit!!!</h1>
  </div>

  <div class="m-2">
    <input
      type="text"
      bind:value={$searchText}
      class="input input-bordered w-full max-w-full text-center"
      placeholder="Enter number..."
    />
  </div>

  <!-- Display the count of matched verses -->
  <div class="text-center my-2">
    {#if $totalFilteredVerses !== null}
      <p>Number of verses displayed: {$totalFilteredVerses}</p>
    {/if}
  </div>

  <!-- Accordion Toggle Button -->
  <button class="btn btn-sm btn-primary my-2" on:click={toggleAccordion}>
    {isAccordionOpen ? "Hide Books" : "Show Books"}
  </button>

  <!-- Accordion Content: Book Buttons -->
  {#if isAccordionOpen}
    <div class="grid grid-cols-4 space-y-1 justify-center items-center">
      <button class="btn btn-sm btn-primary" on:click={showAllBooks}>All</button
      >
      {#each $filteredVerses as book (book.name)}
        <button
          class="btn btn-sm btn-primary mx-1"
          on:click={() => showOnlyBook(book.name)}
        >
          {truncate(book.name)}
        </button>
      {/each}
    </div>
  {/if}
</div>

<div class="m-4">
  {#each $filteredVerses as book}
    {#if $visibleBook === null || $visibleBook === book.name}
      <h2 class="text-2xl uppercase underline underline-offset-2">
        {book.name}
      </h2>
      <div class="">
        {#each book.verses_with_numbers as verse}
          <div class="my-2 card bg-slate-100 text-slate-900 p-2">
            <strong>{book.name} {verse.chapter}:{verse.verse}</strong>
            <p>{@html verse.text}</p>
          </div>
        {/each}
      </div>
    {/if}
  {/each}
</div>

<HelpModal
  bind:isOpen={modalOpen}
  bind:openOnStart
  on:close={handleModalClose}
  on:update={handleModalUpdate}
/>
