<script>
  import "../app.postcss";
  import Navbar from "$lib/components/Navbar.svelte";

  import { onMount } from "svelte";

  onMount(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  });
</script>

<Navbar />
<slot />
