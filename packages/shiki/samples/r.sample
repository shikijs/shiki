Year.Release <- game$Year.Release
counts <- data.frame(table(Year.Release))
p <- game %>%
  select(Year.Release, Global.Sales) %>%
  group_by(Year.Release) %>%
  summarise(Total.Sales = sum(Global.Sales))
q <- cbind.data.frame(p, counts[2])  # Add counts to data frame
names(q)[3] <- "count"
q$count <- as.numeric(q$count)

ggplot(q, aes(x = Year.Release, y = Total.Sales, label = q$count)) +
  geom_col(fill = "green") +
  geom_point(y = q$count * 500000, size = 3, shape = 21, fill = "Yellow" ) +
  geom_text(y = (q$count + 50) * 500000) +  # Position of the text: count of games each year
  theme(axis.text.x = element_text(angle = 90),
        panel.background = element_rect(fill = "purple"),
        panel.grid.major = element_blank(),
        panel.grid.minor = element_blank()) +
  scale_x_discrete("Year.Release", labels = as.character(Year.Release), breaks = Year.Release)

# From https://gexijin.github.io/learnR/the-game-sales-dataset.html#analysis-of-sales
