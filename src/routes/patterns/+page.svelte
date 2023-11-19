<script>
  import PatternsNavbar from "$lib/components/PatternsNavbar.svelte";
</script>

<PatternsNavbar />

<!-- Display Grouped Patterns by Count, then by Book -->
<div class="grid justify-center items-center p-6 text-6xl text-center">
  <p class="my-4">Patterns View</p>
  <p class="my-4 text-xl text-justify">
    You can either view the patterns by the Books of the Bible, or you can view
    them within the Bible as a whole which includes the counts of these
    patterns.
  </p>
  <a href="/patterns/bybook" class="text-2xl btn btn-outline btn-success my-4"
    >By Book</a
  >
  <a href="/patterns/bybible" class="text-2xl btn btn-outline btn-success my-4"
    >By Entire Bible</a
  >
</div>
