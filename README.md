# scrabble-dictionaries

Archive of [Scrabble](https://en.wikipedia.org/wiki/Scrabble) dictionaries in various languages.

Used by [Scrabble Solver](https://scrabble-solver.org) ([kamilmielnik/scrabble-solver](https://github.com/kamilmielnik/scrabble-solver)).

## Format

Every dictionary is a plain [UTF-8](https://en.wikipedia.org/wiki/UTF-8) text file that follows these rules:

- one word per line, separated by [LF](https://en.wikipedia.org/wiki/Newline), with no trailing LF after the last word
- words are lowercase and [NFC](https://unicode.org/reports/tr15/)-normalized
- words are sorted by Unicode code point, the order produced by `LC_ALL=C sort`
- no duplicates, no empty lines, no surrounding whitespace, no byte order mark

`npm run check` validates every dictionary against these rules.

## Updating

`npm run update` downloads the Romanian and Spanish FISE dictionaries from their sources and normalizes them. The remaining dictionaries were obtained manually; their sources are listed in the language READMEs.

## Adding a dictionary

1. Save the file as `<language>/<name>.txt`. For a new language, create the directory and add its locale to `scripts/locales.js`.
2. Normalize the file to the format above: lowercase, deduplicate and sort it the way `scripts/words.js` does.
3. Run `npm run check`.
4. Describe the dictionary in `<language>/README.md`: what it is, where it came from and which edition or date it corresponds to.
