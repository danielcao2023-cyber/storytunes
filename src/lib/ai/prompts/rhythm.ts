export const RHYTHM_PROMPT = `
For each page, also create a "rhythm version" of the text. This is a chant/rhyme version where:
1. Words are grouped into rhythmic phrases
2. Stressed syllables are marked with ● and unstressed with ○
3. Each line has 2-4 beats
4. The rhythm is consistent across pages

Example input: "I see a red ball. The red ball is big."
Example rhythm output:
text: "I see a RED ball ● ○ ●\\nThe ball is BIG ○ ● ○"

Format the rhythm text as lines separated by newlines, and beats as ●/○ separated by spaces.
`;
