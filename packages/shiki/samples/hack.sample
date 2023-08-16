<<__EntryPoint>>
async function my_example(): Awaitable<void> {
  $user_ids = vec[1, 2, 3];

  // Initiate all the database requests together,
  // so we spend less time waiting.
  $user_names = await Vec\map_async(
    $user_ids,
    async ($id) ==> await fetch_user_name($id),
  );
  // Execution continues after requests complete.

  echo Str\join($user_names, ", ");
}

async function fetch_user_name(
  int $_,
): Awaitable<string> {
  // This could be a database request.
  return "";
}

// From hacklang.org
