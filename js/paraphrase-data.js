// Reference bank of common word groups for paraphrasing in IELTS Writing —
// swap the base word for one of its synonyms when rewording the question
// or avoiding repetition between paragraphs.
window.IELTS_PARAPHRASE_GROUPS = [
  { base: "increase (v)", category: "Verbs", synonyms: ["rise", "grow", "climb", "escalate", "surge"], example: "The number of applicants increased significantly last year." },
  { base: "decrease (v)", category: "Verbs", synonyms: ["decline", "drop", "fall", "diminish", "dwindle"], example: "Public trust in the institution has decreased over time." },
  { base: "show / indicate (v)", category: "Verbs", synonyms: ["reveal", "demonstrate", "suggest", "illustrate", "highlight"], example: "The data shows a clear link between income and education." },
  { base: "believe / think (v)", category: "Verbs", synonyms: ["argue", "contend", "maintain", "hold the view that", "assert"], example: "Many economists believe that automation will reshape the job market." },
  { base: "help (v)", category: "Verbs", synonyms: ["assist", "aid", "facilitate", "contribute to"], example: "Regular exercise helps reduce stress." },
  { base: "cause (v)", category: "Verbs", synonyms: ["lead to", "result in", "bring about", "trigger"], example: "Poor urban planning causes traffic congestion." },
  { base: "improve (v)", category: "Verbs", synonyms: ["enhance", "boost", "strengthen", "upgrade"], example: "The new policy is expected to improve air quality." },
  { base: "reduce (v)", category: "Verbs", synonyms: ["cut", "lower", "minimise", "curb"], example: "The government aims to reduce carbon emissions by 2030." },
  { base: "avoid (v)", category: "Verbs", synonyms: ["prevent", "refrain from", "steer clear of"], example: "Stricter regulations can help avoid workplace accidents." },
  { base: "allow / let (v)", category: "Verbs", synonyms: ["permit", "enable", "make it possible for"], example: "Remote work allows employees to manage their own schedules." },

  { base: "important (adj)", category: "Adjectives", synonyms: ["crucial", "vital", "essential", "significant", "key"], example: "Early education plays a crucial role in a child's development." },
  { base: "good (adj)", category: "Adjectives", synonyms: ["beneficial", "advantageous", "favourable", "positive"], example: "The reform has had a beneficial effect on small businesses." },
  { base: "bad (adj)", category: "Adjectives", synonyms: ["detrimental", "harmful", "adverse", "damaging"], example: "Excessive screen time can have a detrimental effect on sleep." },
  { base: "big / large (adj)", category: "Adjectives", synonyms: ["substantial", "considerable", "significant", "sizeable"], example: "A substantial proportion of the budget is spent on healthcare." },
  { base: "small (adj)", category: "Adjectives", synonyms: ["minor", "negligible", "marginal", "slight"], example: "The change had only a marginal impact on sales." },
  { base: "difficult (adj)", category: "Adjectives", synonyms: ["challenging", "demanding", "arduous", "complex"], example: "Balancing work and study can be particularly challenging." },
  { base: "easy (adj)", category: "Adjectives", synonyms: ["straightforward", "effortless", "simple", "uncomplicated"], example: "Online banking has made transferring money a straightforward process." },
  { base: "common (adj)", category: "Adjectives", synonyms: ["widespread", "prevalent", "commonplace", "universal"], example: "Remote working has become widespread since the pandemic." },
  { base: "clear / obvious (adj)", category: "Adjectives", synonyms: ["evident", "apparent", "unmistakable"], example: "It is evident that public transport needs further investment." },

  { base: "problem (n)", category: "Nouns", synonyms: ["issue", "challenge", "difficulty", "obstacle"], example: "Traffic congestion remains a major issue in most large cities." },
  { base: "solution (n)", category: "Nouns", synonyms: ["remedy", "resolution", "measure", "countermeasure"], example: "Investing in public transport is one practical measure to ease congestion." },
  { base: "children (n)", category: "Nouns", synonyms: ["youngsters", "minors", "the younger generation"], example: "Youngsters today are exposed to technology from a very young age." },
  { base: "people (n)", category: "Nouns", synonyms: ["individuals", "citizens", "the public", "members of society"], example: "Individuals from lower-income backgrounds often face greater barriers." },
  { base: "government (n)", category: "Nouns", synonyms: ["authorities", "policymakers", "the state", "officials"], example: "Local authorities have introduced new recycling schemes." },
  { base: "money (n)", category: "Nouns", synonyms: ["funds", "finances", "capital", "resources"], example: "Additional funds have been allocated to public healthcare." },
  { base: "job (n)", category: "Nouns", synonyms: ["occupation", "profession", "employment", "career"], example: "Many graduates struggle to find stable employment." },
  { base: "advantage (n)", category: "Nouns", synonyms: ["benefit", "merit", "upside"], example: "One clear benefit of remote work is reduced commuting time." },
  { base: "disadvantage (n)", category: "Nouns", synonyms: ["drawback", "downside", "limitation"], example: "A major drawback of online learning is the lack of social interaction." },

  { base: "many / a lot of", category: "Quantifiers", synonyms: ["numerous", "a great number of", "a considerable amount of", "a substantial number of"], example: "Numerous studies have linked diet to long-term health outcomes." },
  { base: "few / not much", category: "Quantifiers", synonyms: ["a small number of", "a limited number of", "scarcely any"], example: "Only a limited number of rural schools have internet access." },
  { base: "most", category: "Quantifiers", synonyms: ["the majority of", "the greater part of"], example: "The majority of respondents supported the new policy." },

  { base: "because", category: "Connectors", synonyms: ["owing to", "due to", "as a result of", "given that"], example: "Owing to rising costs, many families have cut back on travel." },
  { base: "however", category: "Connectors", synonyms: ["nevertheless", "that said", "yet", "on the other hand"], example: "The policy is well-intentioned; nevertheless, it has proven costly to implement." },
  { base: "also / and", category: "Connectors", synonyms: ["furthermore", "in addition", "moreover", "besides"], example: "Furthermore, the scheme has created hundreds of new jobs." },
  { base: "so / therefore", category: "Connectors", synonyms: ["consequently", "as a result", "thus", "hence"], example: "Fewer people are driving; consequently, air quality has improved." }
];
