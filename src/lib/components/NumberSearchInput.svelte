<script>
  import { bibleStore } from "$lib/bibleStore";

  //   export let searchVerses; // Export this function so it can be called from the parent component
  let searchText = "";
  filteredVerses = null;

  function searchVerses() {
    const searchNumber = parseInt(searchText, 10);
    if (isNaN(searchNumber)) return [];

    return $bibleStore.flatMap((book) =>
      book.verses_with_numbers.filter(
        (verse) => verse.text.includes(searchNumber.toString())
        // verse.text may need to match different formats, adjust accordingly
      )
    );
  }
</script>

<!-- <input
  class="flex justify-center w-full text-center my-4"
  type="text"
  bind:value={searchText}
  on:input={() => (filteredVerses = searchVerses())}
/> -->
