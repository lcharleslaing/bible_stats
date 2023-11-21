<script>
  export let secondTitle = "Default Second Title";
  export let thirdTitle = "Default Third Title";
  export let imageUrl = ""; // Exported prop for the image source
  export let para = "";
</script>

<div class="my-4 text-center">
  {#if imageUrl}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img src={imageUrl} alt="Title Image" width="200px" class="mx-auto mb-4" />
  {/if}
  <h1 class="text-2xl font-extrabold">The Chosen Few</h1>
  <h1 class="text-xl font-extrabold">{secondTitle}</h1>
  <h1 class="text-xl font-extrabold">{thirdTitle}</h1>
  <p class="mx-2 my-4 text-center">{para}</p>
</div>

<style>
  /* Add any additional styling for your image if needed */
  img {
    max-width: 100%;
    height: auto;
  }
</style>
