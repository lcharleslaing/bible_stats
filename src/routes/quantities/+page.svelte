<!-- +page.svelte "/quantities" route THIS ONE DOES NOT WORK-->
<script>
  import { bibleStore, loadBibleData } from "$lib/bibleStore";
  import { loadQuantitiesData, uniqueNumbersStore } from "$lib/quantitiesStore";
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";

  const selectedNumber = writable(null);
  let isAccordionOpen = false;

  onMount(async () => {
    await loadBibleData();
    await loadQuantitiesData();
  });

  const filteredVerses = derived(
    [bibleStore, selectedNumber],
    ([$bibleStore, $selectedNumber]) => {
      console.log("Selected Number (raw):", $selectedNumber);

      if ($selectedNumber === null) {
        console.log("Displaying all verses");
        return $bibleStore.flatMap((book) => book.verses_with_numbers);
      } else {
        // Convert $selectedNumber to a string for comparison
        const selectedStr = String($selectedNumber);
        console.log("Selected Number (string):", selectedStr);

        const filtered = $bibleStore
          .flatMap((book) => book.verses_with_numbers)
          .filter((verse) => {
            console.log("Processing verse:", verse);
            if (!verse.numeric_numbers) {
              console.log("No numeric_numbers array in this verse.");
              return false;
            }
            const isMatch = verse.numeric_numbers.includes(selectedStr);
            console.log("Does the verse match the selected number?", isMatch);
            return isMatch;
          });
        console.log("Filtered Verses:", filtered);
        return filtered;
      }
    }
  );

  function selectNumber(number) {
    selectedNumber.set(number);
    console.log("Number selected for filter:", number);
    isAccordionOpen = false;
  }

  function toggleAccordion() {
    isAccordionOpen = !isAccordionOpen;
  }

  function showAllBooks() {
    selectedNumber.set(null);
    console.log("Showing all books");
    isAccordionOpen = false;
  }

  const totalFilteredVerses = derived(
    filteredVerses,
    ($filteredVerses) => $filteredVerses.length
  );
  console.log("Filter Quantity: ", $filteredVerses.length);
</script>

<div class="m-6">
  <div class="my-4">
    <h1 class="text-2xl text-center font-extrabold">The Chosen Few</h1>
    <h1 class="text-2xl text-center">KJV Bible Number Qty's</h1>
    <h1 class="text-2xl text-center font-extrabold">It's All Giberish!!!</h1>
  </div>

  <!-- Display the count of matched verses -->
  <div class="text-center my-2">
    {#if $totalFilteredVerses !== null}
      <p>Qty of verses: {$totalFilteredVerses}</p>
    {/if}
  </div>

  <!-- Accordion Toggle Button -->
  <button class="btn btn-sm btn-accent my-2" on:click={toggleAccordion}>
    {isAccordionOpen ? "Hide Numbers" : "Show Numbers"}
  </button>

  <!-- Accordion Content: Book Buttons -->
  {#if isAccordionOpen}
    <div class="grid grid-cols-3 space-y-1 justify-center items-center">
      <button class="btn btn-sm bg-slate-700 text-white" on:click={showAllBooks}
        >All</button
      >
      {#each $uniqueNumbersStore.sortedNumbers as number}
        <button
          class="btn btn-sm bg-slate-500 text-white mx-1"
          on:click={() => selectNumber(number)}>{number}</button
        >
      {/each}
    </div>
  {/if}
</div>

<div class="m-4">
  {#each $filteredVerses as verse}
    <div class="my-2 card bg-slate-100 text-slate-900 p-2">
      <strong>{verse.book} {verse.chapter}:{verse.verse}</strong>
      <p>{@html verse.text}</p>
    </div>
  {/each}
</div>
