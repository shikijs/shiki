CND ← {
    X ← ⍵
    a ← 0.31938153 ¯0.356563782 1.781477937 ¯1.821255978 1.330274429

    l ← |X
    k ← ÷1+0.2316419×l
    w ← 1 - (÷((2×(○1))*0.5)) × (*-(l×l)÷2) × (a +.× (k*⍳5))

    ((|0⌊×X)×(1-w))+(1-|0⌊×X)×w
}

⍝ S - current price
⍝ X - strike price
⍝ T - expiry in years
⍝ r - riskless interest rate
⍝ v - volatility

S ← 60
X ← 65
T ← 1
r ← 0.1
v ← 0.2

d1 ← { ((⍟S÷X)+(r+(v*2)÷2)×⍵)÷(v×⍵*0.5) }
d2 ← { (d1 ⍵) -v×⍵*0.5 }

⍝ Call price
callPrice ← { (S×CND(d1 ⍵))-(X×*-r×⍵)×CND(d2 ⍵) }

avg ← { (+/⍵) ÷ ⊃⍴ ⍵ }

⎕←avg callPrice¨ (⍳ 100000) ÷ 10000

⍝ Put price (not tested)
⍝ putPrice ← { (X×*-r×⍵)×CND(-d2 ⍵)-S×CND(-d1 ⍵) }

⍝ From https://github.com/melsman/apltail/blob/master/tests/blacksch.apl
