module Main where

import Data.Either (Either(..))
import Data.Eq (class Eq)
import Data.Function.Uncurried (Fn2, mkFn2, runFn2)
import Data.List (List(..), filter, (:))
import Data.Maybe (Maybe(..))
import Data.String.Regex (Regex, parseFlags, regex, replace)
import Effect (Effect)
import Effect.Console (log, logShow)
import Partial.Unsafe (unsafePartial)
import Prelude (Unit, discard, map, mod, show, (+), (==), ($), (/=), (<>))

type Dict key value = key → Maybe value

emptyDict :: ∀ k v. Dict k v
emptyDict _ = Nothing

insertDict :: ∀ k v. (Eq k) => k → v → Dict k v → Dict k v
insertDict key value dict =
  \key' → if key == key'
            then (Just value)
            else dict key'


-- | Take a look at src/Main.js to see how we curry arguments
-- | in Javascript
foreign import myAdd :: Int → Int → Int

-- | When performance is critical then use Data.Function.Uncurried
myAddFast :: Fn2 Int Int Int
myAddFast = mkFn2 \x y → x + y

add10 :: Int -> Int
add10 = myAdd 10

modulo :: Int -> Int -> Int
modulo dvr dvd = dvd `mod` dvr

isOdd :: Int -> Int
isOdd = modulo 2

getAllOdds :: List Int -> List Int
getAllOdds = filter (\x -> isOdd x /= 0)

regexString :: Regex
regexString =
  unsafePartial
    case (regex "[aeiou]" (parseFlags "ig")) of
      Right r -> r

censor :: String -> String
censor = replace regexString "*"

censorAll :: Array String -> Array String
censorAll = map censor

main :: Effect Unit
main = do
  log "Build curried functions"
  log "\nAdvantage 1: Partially applying functions"
  log     $ "myAdd: " <> (show $ myAdd 2 2)
  log "\nAdvantage 2: function types"
  -- notice key' == key ('a' == 'a'), so return Just 1
  logShow $ (insertDict 'a' (1::Int) emptyDict) 'a'
  -- search for 'a' in Dict and return its value
  logShow $ insertDict 'b' 2 (insertDict 'a' (1::Int) emptyDict) 'a'
  -- the 'x' key is not in Dict, so fall back to Nothing
  logShow $ insertDict 'b' 2 (insertDict 'a' (1::Int) emptyDict) 'x'
  log "\nCurrying Examples: add10, isOdd, isOdd21, getAllOdds"
  logShow $ add10 2
  logShow $ isOdd 2
  logShow $ isOdd 21
  logShow $ getAllOdds (1 : 2 : 3 : 4 : Nil)
  log "\nBuild up predicate functions"
  log $ censor "hello world"
  logShow $ censorAll ["hello", "world"]
  log "\nUse Data.Function.Uncurried when performance is critical"
  logShow $ runFn2 myAddFast 10 10

-- From https://github.com/adkelley/javascript-to-purescript/blob/master/tut17/src/Main.purs
