<script lang="ts">
  let rocks: Array<Array<string>> = [
    //            Y     P      PY   Y @colors
    ["Rock", "Stone"],
    //              P @colors 4=P
    ["Rock", "Roll", "Stone"],
    //                      P @colors 4=P
  ];
  // @colors 2=Y
</script>

<p>
  {#each rocks as rockWords}
    <!--                   Y @colors 2=Y -->
    {#each rockWords as rock, i}
      <!--                     Y @colors 4=Y -->
      {rock}
      <!-- Y @colors 6=Y -->
      {i < rocks.length - 1 ? "and" : ""}
      <!--                              Y @colors=6=Y -->
    {/each}
    <!--  Y @colors 4=Y -->
  {/each}
  <!--  Y @colors 2=Y -->
  !
</p>

<style>
  p {
    /* @colors 4=Y */
    color: orangered;
    font-weight: bold;
  }
  /* @colors 2=Y */
</style>
