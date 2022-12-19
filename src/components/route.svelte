<script>
  export let currentRoute = {};
  export let params = {};
</script>

{#if currentRoute && currentRoute.layout && currentRoute.layoutProps}
  <svelte:component
    this={currentRoute.layout}
    currentRoute={{ ...currentRoute, layout: '' }}
    {...currentRoute.layoutProps}
    {params}
  />
{:else if currentRoute && currentRoute.layout}
  <svelte:component
    this={currentRoute.layout}
    currentRoute={{ ...currentRoute, layout: '' }}
    {...currentRoute.layoutProps}
    {params}
  />
{:else if currentRoute && currentRoute.component}
  <svelte:component
    this={currentRoute.component}
    currentRoute={{ ...currentRoute, component: '' }}
    {params}
    {...currentRoute.componentProps}
  />
{:else if currentRoute && currentRoute.component && currentRoute.componentProps}
  <svelte:component
    this={currentRoute.component}
    currentRoute={{ ...currentRoute, component: '' }}
    {params}
    {...currentRoute.componentProps}
  />
{:else if currentRoute && currentRoute.childRoute}
  <svelte:self currentRoute={currentRoute.childRoute} {params} />
{:else if currentRoute && currentRoute.componentProps}
  <svelte:component this={currentRoute.component} {...currentRoute.componentProps} />
{/if}
