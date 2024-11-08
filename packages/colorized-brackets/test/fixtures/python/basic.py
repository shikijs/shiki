from collections.abc import Callable, Awaitable

def feeder(get_next_item: Callable[[], str]) -> None:
    #     Y                       PBB     PY @colors
    pass

def async_query(on_success: Callable[[int], None],
                #                   PB   B      P @colors 15=Y
                on_error: Callable[[int, Exception], None]) -> None:
                #                 PB              B      PY @colors
    pass

async def on_update(value: str) -> None:
    #              Y          Y @colors
    pass

callback: Callable[[str], Awaitable[None]] = on_update
#                 YP   P           P    PY @colors

l = [1, 2, 3]
#   Y       Y @colors
s = f"last: {l[-1]}"
#           Y P  PY @colors