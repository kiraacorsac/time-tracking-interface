<script context="module">
  // retain module scoped expansion state for each tree node
  const _expansionState = {
    /* treeNodeId: expanded <boolean> */
  };
</script>

<script lang="ts">
  //	import { slide } from 'svelte/transition'
  import { type TreeViewData } from "./TreeViewTypes";
  export let tree: TreeViewData;
  const { content, children, component, initiallyExpanded, hr } = tree;

  let expanded = _expansionState[content] || initiallyExpanded || false;
  const toggleExpansion = () => {
    expanded = _expansionState[content] = !expanded;
  };
  $: arrowDown = expanded;
</script>

<ul>
  <!-- transition:slide -->
  <li>
    {#if children}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div on:click={toggleExpansion}>
        {#if hr}
          <hr />
        {/if}
        <span class="arrow" class:arrowDown>&#x25b6</span>
        {#if component}
          <svelte:component this={component} {...content} />
        {:else}
          {content}
        {/if}
      </div>
      {#if expanded}
        {#each children as child}
          <svelte:self tree={child} />
        {/each}
      {/if}
    {:else}
      <span>
        <span class="no-arrow" />
        {#if component}
          <svelte:component this={component} {...content} />
        {:else}
          {content}
        {/if}
      </span>
    {/if}
  </li>
</ul>

<style>
  ul {
    margin: 0;
    list-style: none;
    padding-left: 1.2rem;
    user-select: none;
  }
  .no-arrow {
    padding-left: 1rem;
  }
  .arrow {
    cursor: pointer;
    display: inline-block;
    /* transition: transform 200ms; */
  }
  .arrowDown {
    transform: rotate(90deg);
  }
</style>
