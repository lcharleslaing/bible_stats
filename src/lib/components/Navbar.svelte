<script>
  import { page } from "$app/stores";

  // Reactive statement to get the current pathname
  $: currentPath = $page.url.pathname;
</script>

<div class="mx-2 my-4 flex justify-center gap-1 items-center">
  <a
    class="btn btn-sm {currentPath === '/'
      ? 'bg-black text-white border border-white'
      : 'btn-success'}"
    href="/">Verses</a
  >
  <!-- <a disabled class="btn btn-sm btn-primary" href="/dates">Dates</a> -->
  <a
    class="btn btn-sm {currentPath === '/quantities'
      ? 'bg-black text-white border border-white'
      : 'btn-success'}"
    href="/quantities">Numbers</a
  >
  <a
    class="btn btn-sm {currentPath === '/sequences'
      ? 'bg-black text-white border border-white'
      : 'btn-success'}"
    href="/sequences">Counts</a
  >
  <a
    class="btn btn-sm {currentPath === '/patterns'
      ? 'bg-black text-white border border-white'
      : 'btn-success'}"
    href="/patterns">Patterns</a
  >
</div>
