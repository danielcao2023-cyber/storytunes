export const TODDLER_VOCABULARY = `
You MUST use ONLY words from a 200-300 word toddler vocabulary.
Acceptable words include:
- Colors: red, blue, green, yellow, orange, purple, pink, brown, black, white
- Animals: cat, dog, bird, fish, cow, pig, duck, bear, bunny, frog, sheep, horse
- Numbers: one, two, three, four, five, six, seven, eight, nine, ten
- Body: eyes, nose, mouth, ears, hands, feet, head, tummy
- Family: mommy, daddy, baby, brother, sister
- Objects: ball, car, book, bed, chair, table, cup, hat, shoe, sun, moon, star, tree, flower, house, door
- Food: apple, banana, milk, water, cookie, bread, egg
- Actions: run, jump, eat, sleep, sit, stand, go, come, look, see, hear, clap, wave, hug, kiss, play, read, sing
- Descriptors: big, small, hot, cold, happy, sad, good, pretty, funny, soft
- Function words: a, an, the, is, are, am, I, you, me, my, your, in, on, up, down, here, there, this, that, and, not, yes, no, please

DO NOT use any words outside this list. If a concept requires a word not listed, find a simpler alternative.
`;

export const LEVEL_CONSTRAINTS = {
  seed: {
    maxWords: 20,
    sentencesPerPage: 1,
    wordsPerSentence: '3-5',
    structure:
      'One short sentence per page. Labeling style: "I see a cat." "The ball is red." Each page introduces one new word.',
    pageCount: 6,
  },
  sprout: {
    maxWords: 50,
    sentencesPerPage: '1-2',
    wordsPerSentence: '5-8',
    structure:
      '1-2 sentences per page with a repeating pattern. "The cow says moo. The pig says oink." Build on the pattern each page.',
    pageCount: 8,
  },
  tree: {
    maxWords: 80,
    sentencesPerPage: '2-4',
    wordsPerSentence: '6-10',
    structure:
      'Simple narrative with beginning, middle, end. 2-4 sentences per page. Connect pages with simple cause-effect: "The bunny is hungry. He looks for food."',
    pageCount: 8,
  },
} as const;
