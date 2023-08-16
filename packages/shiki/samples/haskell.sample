{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeFamilies #-}
{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}

import Yesod

data WebApp = WebApp

instance Yesod WebApp

mkYesod "WebApp" [parseRoutes|
  / HomeR GET
|]

getHomeR = defaultLayout [whamlet|
  <div>Hello, world!
|]

main = warpEnv WebApp

{-# From https://www.schoolofhaskell.com/user/eriks/Simple%20examples }
