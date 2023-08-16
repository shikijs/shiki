proc set'contains {set el} {expr {[lsearch -exact $set $el]>=0}}

e.g. {set'contains {A B C} A} -> 1
e.g. {set'contains {A B C} D} -> 0

proc set'add {_set args} {
   upvar 1 $_set set
   foreach el $args {
       if {![set'contains $set $el]} {lappend set $el}
   }
   set set
}

set example {1 2 3}
e.g. {set'add example 4} -> {1 2 3 4}
e.g. {set'add example 4} -> {1 2 3 4}

proc set'remove {_set args} {
   upvar 1 $_set set
   foreach el $args {
       set pos [lsearch -exact $set $el]
       set set [lreplace $set $pos $pos]
   }
   set set
}

e.g. {set'remove example 3} -> {1 2 4}

proc set'intersection {a b} {
   foreach el $a {set arr($el) ""}
   set res {}
   foreach el $b {if {[info exists arr($el)]} {lappend res $el}}
   set res

e.g. {set'intersection {1 2 3 4} {2 4 6 8}} -> {2 4}

proc set'union {a b} {
   foreach el $a {set arr($el) ""}
   foreach el $b {set arr($el) ""}
   lsort [array names arr]
}

e.g. {set'union {1 3 5 7} {2 4 6 8}} -> {1 2 3 4 5 6 7 8}

proc set'difference {a b} {
   eval set'remove a $b
}

e.g. {set'difference {1 2 3 4 5} {2 4 6}} -> {1 3 5}

# https://en.wikibooks.org/wiki/Tcl_Programming/Examples
