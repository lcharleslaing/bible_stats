<script>
  import "../app.postcss";
  import Navbar from "$lib/components/Navbar.svelte";

  import { onMount } from "svelte";

  onMount(() => {
    //   if ("serviceWorker" in navigator) {
    //     navigator.serviceWorker
    //       .register("/service-worker.js")
    //       .then((registration) => {
    //         console.log("SW registered: ", registration);
    //       })
    //       .catch((registrationError) => {
    //         console.log("SW registration failed: ", registrationError);
    //       });
    //   }
  });
</script>

<Navbar />
<slot />
