<script>
  export let currentRoute = {};
  export let params = {};
</script>

{#if currentRoute && currentRoute.layout}
  <svelte:component this={currentRoute.layout} currentRoute={{ ...currentRoute, layout: '' }} {params} />
{:else if currentRoute && currentRoute.component}
  <svelte:component this={currentRoute.component} currentRoute={{ ...currentRoute, component: '' }} {params} {...currentRoute.props}/>
{:else if currentRoute && currentRoute.component && currentRoute.props}
  <svelte:component this={currentRoute.component} currentRoute={{ ...currentRoute, component: '' }} {params} {...currentRoute.props}/>
{:else if currentRoute && currentRoute.childRoute}
  <svelte:self currentRoute={currentRoute.childRoute} {params} />
{:else if currentRoute && currentRoute.props}
  <svelte:component this={currentRoute.component} {...currentRoute.props}/>
{/if}
