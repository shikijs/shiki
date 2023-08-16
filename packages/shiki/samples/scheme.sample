(define WINDOW-WIDTH 150)
(define WINDOW-HEIGHT 180)

; A world is a number.
; Its display is a blue disk of that size.
; show-world : world -> image
(define (show-world diameter)
  (circle diameter "solid" "blue"))
"Examples of show-world:"
(show-world 1) "should be a blue dot"
(show-world 20) "should be" (circle 20 "solid" "blue")

; The next world is one larger.
; next-world : world -> world
(define (next-world diameter)
  (+ 1 diameter))
"Examples of next-world:"
(next-world 7) "should be" 8

"Now let's start the animation!"

(big-bang WINDOW-WIDTH WINDOW-HEIGHT 1 1)
(on-update-event show-world)
(on-tick-event next-world)

; From https://home.adelphi.edu/sbloch/class/archive/160/spring2005/examples/
