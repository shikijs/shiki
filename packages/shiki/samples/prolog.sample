#!/usr/bin/swipl
% vim: ft=prolog textwidth=80 tabstop=4 softtabstop=4 shiftwidth=4 expandtab

map_size(78, 23).
map_upper_bound(XMax, YMax) :-
    map_size(XSize, YSize),
    XMax is XSize - 1,
    YMax is YSize - 1.

in_map(X, Y) :-
    X >= 0,
    Y >= 0,
    map_size(XSize, YSize),
    X < XSize,
    Y < YSize.

tile(wall, X, Y) :- \+ in_map(X, Y).
tile(floor, X, Y) :- in_map(X, Y).
% tile(wall, 0, _).
% tile(wall, _, 0).
% tile(wall, X, _) :- map_upper_bound(X, _).
% tile(wall, _, Y) :- map_upper_bound(_, Y).

:- dynamic(player/2, messages/1).

player(2,3).
messages(["", ""]).
message_lines(2).

msg(Message) :-
    messages(Tail),
    retractall(messages(_)),
    assertz(messages([Message|Tail])).

%%%%%%%%%%%%%%%%
% drawing code %
%%%%%%%%%%%%%%%%

draw_char(_X, Y) :-
    tty_size(YSize, _),
    % map_size(_, YSize),
    Y >= YSize.
draw_char(X, Y) :-
    tty_size(_, XSize),
    % map_size(XSize, _),
    X >= XSize,
    NY is Y + 1,
    %nl,
    draw_char(0, NY).
draw_char(X, Y) :-
    ( X = 0
    ->tty_goto(X, Y)
    ; true
    ),

    message_lines(YMsgs),
    (  Y < YMsgs
    -> write(' ')
    ; display_offset(XOff, YOff),
      XMap is X + XOff,
      YMap is Y + YOff,
      get_character(XMap, YMap, C),
      format('~s', [C])
    ),
    NX is X + 1,
    draw_char(NX, Y).

display_offset(X, Y) :-
    player(XPos, YPos),
    tty_size(YSize, XSize),
    message_lines(YMsgs),
    X is XPos - floor(XSize / 2),
    Y is YPos - floor((YSize - YMsgs) / 2).

display_msgs(Line) :- message_lines(Line).
display_msgs(Line) :-
    message_lines(LineCount),
    MsgId is LineCount - Line,
    messages(Messages),
    nth1(MsgId, Messages, Message),
    tty_goto(0, Line),
    format('~s', [Message]),
    NextLine is Line + 1,
    display_msgs(NextLine).

draw :-
    once(draw_char(0, 0)),
    map_size(_, YSize),
    display_msgs(0),
    tty_goto(0, YSize).

% character displayed for a position on map
get_character(X, Y, "@") :- player(X, Y).
get_character(X, Y, C) :-
    tile(Tile, X, Y),
    tile_display(Tile, C).

tile_display(wall, "#").
tile_display(floor, ".").

tile_passable(floor).

% % get line of a map to display as a string into aggregator, starting from XCur
% % as rightmost character
% get_line(Y, XCur, Trail, Agg) :-
%     (  XCur < 0
%     -> Trail = Agg
%     ;  XPrev is XCur - 1,
%        get_character(XCur, Y, C),
%        get_line(Y, XPrev, [C|Trail], Agg)
%     ).

% get_screen(YCur, Trail, Agg) :-
%     (  YCur < 0
%     -> Trail = Agg
%     ;  YPrev is YCur - 1,
%        map_size(XSize, _),
%        XLast is XSize - 1,
%        get_line(YCur, XLast, [], Line),
%        get_screen(YPrev, [Line|Trail], Agg)
%     ).

% get_screen(Lines) :-
%    map_size(_, YSize),
%    YLast is YSize - 1,
%    get_screen(YLast, [], Lines).

% % draw a list of lines on screen
% draw_lines([]).
% draw_lines([Line|Rest]) :-
%     name(LineAtom, Line),
%     write(LineAtom),
%     nl,
%     draw_lines(Rest).

% % draw current map
% draw :- get_screen(Lines), draw_lines(Lines).

%%%%%%%%%%%%%%%%%%%%
% interaction code %
%%%%%%%%%%%%%%%%%%%%

move_player(X, Y) :-
    player(XCur, YCur),
    XNew is XCur + X,
    YNew is YCur + Y,
    (  tile(Tile, XNew, YNew),
       tile_passable(Tile)
    -> retractall(player(_, _)),
       asserta(player(XNew, YNew))
    ;  print('Bump!'), nl
    ).

act("\n").
act("\r").

act("h") :- msg("left"),  move_player(-1,  0).
act("j") :- msg("down"),  move_player( 0,  1).
act("k") :- msg("up"),    move_player( 0, -1).
act("l") :- msg("right"), move_player( 1,  0).

act("y") :- move_player(-1, -1).
act("u") :- move_player( 1, -1).
act("b") :- move_player(-1,  1).
act("n") :- move_player( 1,  1).

mainloop :-
    draw,
    get_single_char(C),
    (  act([C])
    -> true
    ;  format(codes(Msg), 'unknown character code: ~d', [C]),
       msg(Msg)
    ),
    mainloop.

main :- mainloop.

% From https://github.com/Anniepoo/prolog-examples/blob/master/roguelike.pl
