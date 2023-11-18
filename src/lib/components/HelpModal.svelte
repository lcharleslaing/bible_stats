<script>
  import { createEventDispatcher } from "svelte";
  export let isOpen = false;
  export let openOnStart = false;
  const dispatch = createEventDispatcher();

  function close() {
    isOpen = false;
    dispatch("close");
  }

  function toggleOpenOnStart() {
    openOnStart = !openOnStart;
    dispatch("update", { openOnStart });
  }
</script>

{#if isOpen}
  <div class="modal modal-open">
    <div class="modal-box relative">
      <button
        class="btn btn-sm btn-circle absolute right-2 top-2"
        on:click={close}>✕</button
      >
      <h3 class="text-lg font-bold text-yellow-700 font-extrabold">
        Praise GOD LET's GOOOO!!!
      </h3>
      <p class="py-2 text-green-600">
        It's Pretty Simple and I hope this helps someone as you wonderful family
        digs deep into the Book of Truth!
      </p>
      <p class="py-2">
        I made this to show all verses that contain numbers in one form or
        fashion, but mostly numbers in text form.
      </p>
      <p class="py-2">1. Click "Show Books" ro display the Bible Books</p>
      <p class="py-2">2. Click "All", to show all books (Default) or</p>
      <p class="py-2">3. Click the Book you want to look at specifically</p>
      <p class="py-2">
        4. In the Input Field, you can type in a Numeric Number to search all
        the book that contain numbers and they will show in the list below.
      </p>
      <p class="py-2">
        5. Click 1, then 2, To show all books with your number in them or 3. To
        show the book that contains those numbers.
      </p>
      <p class="py-2">
        <strong class="text-yellow-700"
          >COMING TOMORROW (FINGERS CROSSED)</strong
        >
        The other 3 tabs at the top will be for the other 3 forms of numbers that
        I want to display about the Bible. QUANTITIES, the number of times a word
        is used, and the number of times a word is used in a book. SEQUENCES, the
        number of times a number is used in a verse, and the number of times a number
        is used in a sequence in a book. PATTERNS, the number of times a number is
        used in a verse, chapter and book.
      </p>
      <p class="py-2 text-yellow-700 font-extrabold text-xl">Errors</p>
      <p class="py-2">
        As you go through this you may find something like below...Let me know
        and I'll fix them and I will be going through and fixing them as I find
        them over the next couple days.
      </p>
      <p class="py-2">
        <strong class="text-red-700">EIGHT (8) HUNDRED (100)</strong> This is an
        error and if you see this let me know and I can get it fixed.
      </p>
      <p class="py-2">
        <strong class="text-green-700">EIGHT HUNDRED (800)</strong> This is what
        it is supposed to total to.
      </p>
      <div class="modal-action">
        <label class="label cursor-pointer">
          <span class="label-text mr-4">Hide on Start:</span>
          <input
            type="checkbox"
            class="toggle"
            checked={openOnStart}
            on:click={toggleOpenOnStart}
          />
        </label>
        <button class="btn" on:click={close}>Close</button>
      </div>
    </div>
  </div>
{/if}
