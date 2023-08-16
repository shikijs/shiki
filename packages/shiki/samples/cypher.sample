UNWIND [
    { title: "Cypher Basics I",
      created: datetime("2019-06-01T18:40:32.142+0100"),
      datePublished: date("2019-06-01"),
      readingTime: {minutes: 2, seconds: 15} },
    { title: "Cypher Basics II",
      created: datetime("2019-06-02T10:23:32.122+0100"),
      datePublished: date("2019-06-02"),
      readingTime: {minutes: 2, seconds: 30} },
    { title: "Dates, Datetimes, and Durations in Neo4j",
      created: datetime(),
      datePublished: date(),
      readingTime: {minutes: 3, seconds: 30} }
] AS articleProperties

CREATE (article:Article {title: articleProperties.title})
SET article.created = articleProperties.created,
    article.datePublished = articleProperties.datePublished,
    article.readingTime = duration(articleProperties.readingTime)

// https://neo4j.com/developer/cypher/dates-datetimes-durations/
