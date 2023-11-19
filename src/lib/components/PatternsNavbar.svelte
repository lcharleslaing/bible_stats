<script>
  import { page } from "$app/stores";

  // Function to determine if the current page matches a given href
  function isActive(href) {
    return $page.url.pathname === href;
  }
</script>

<div class="flex m-4 gap-2 justify-center">
  <a
    href="/patterns/bybook"
    class={`btn btn-sm ${
      isActive("/patterns/bybook")
        ? "bg-black text-white border border-white"
        : "btn-success text-black"
    }`}
  >
    View By Book
  </a>
  <a
    href="/patterns/bybible"
    class={`btn btn-sm ${
      isActive("/patterns/bybible")
        ? "bg-black text-white border border-white"
        : "btn-success text-black"
    }`}
  >
    View By Bible as a Whole
  </a>
</div>
