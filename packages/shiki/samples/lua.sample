ball = {
  xpos = 60,
  ypos = 60,

  -- without the colon syntax, must mention self argument explicitly
  move = function(self, newx, newy)
    self.xpos = newx
    self.ypos = newy
  end
}

-- using the colon, ball is passed as self automatically
ball:move(100, 120)

-- using the dot, must pass self explicitly
ball.move(ball, 100, 120)

-- From https://pico-8.fandom.com/wiki/Lua
