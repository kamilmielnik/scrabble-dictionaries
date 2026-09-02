# scrabble-dictionaries

Archive of [Scrabble](https://en.wikipedia.org/wiki/Scrabble) dictionaries in various languages.

Used by [Scrabble Solver](https://scrabble-solver.org) ([kamilmielnik/scrabble-solver](https://github.com/kamilmielnik/scrabble-solver)).

## Dictionaries

| Language | Dictionary | File | Words | Source |
| --- | --- | --- | ---: | --- |
| [English](english) | NASPA Word List (TWL06) | [`twl06.txt`](english/twl06.txt) | 178,691 | [wordgamedictionary.com](https://www.wordgamedictionary.com/twl06/download/twl06.txt) |
| [English](english) | Collins Scrabble Words (SOWPODS) | [`sowpods.txt`](english/sowpods.txt) | 267,752 | [wordgamedictionary.com](https://www.wordgamedictionary.com/sowpods/download/sowpods.txt) |
| [French](french) | ODS8 | [`ods8.txt`](french/ods8.txt) | 411,430 | [Thecoolsim/French-Scrabble-ODS8](https://github.com/Thecoolsim/French-Scrabble-ODS8) |
| [German](german) | German wordlist used by Tanglet | [`german.txt`](german/german.txt) | 675,767 | [hippler/german-wordlist](https://github.com/hippler/german-wordlist) |
| [Persian](persian) | Moein dictionary headwords | [`persian.txt`](persian/persian.txt) | 32,806 | [MansourM/persian-to-persian-dictionary](https://github.com/MansourM/persian-to-persian-dictionary) |
| [Polish](polish) | SJP.PL | [`sjp.txt`](polish/sjp.txt) | 3,229,856 | [sjp.pl](https://sjp.pl/sl/growy/) |
| [Romanian](romanian) | LOC 6.0 | [`loc-6.0.txt`](romanian/loc-6.0.txt) | 706,463 | [dexonline.ro](https://dexonline.ro/scrabble) |
| [Romanian](romanian) | LOC 5.0 | [`loc-5.0.txt`](romanian/loc-5.0.txt) | 679,683 | [dexonline.ro](https://dexonline.ro/scrabble) |
| [Romanian](romanian) | LOC 4.1 | [`loc-4.1.txt`](romanian/loc-4.1.txt) | 640,503 | [dexonline.ro](https://dexonline.ro/scrabble) |
| [Romanian](romanian) | LOC 4.0 | [`loc-4.0.txt`](romanian/loc-4.0.txt) | 640,622 | [dexonline.ro](https://dexonline.ro/scrabble) |
| [Spanish](spanish) | Lexicón FILE 2017 | [`file-2017.txt`](spanish/file-2017.txt) | 639,292 | email |
| [Spanish](spanish) | Lexicón FISE-2 2009 | [`fise-2.txt`](spanish/fise-2.txt) | 636,599 | [redeletras.com](https://www.redeletras.com/diccionario/) |
| [Turkish](turkish) | Kelimelik | [`kelimelik.txt`](turkish/kelimelik.txt) | 64,374 | email |
| [Turkish](turkish) | Türk Dil Kurumu | [`tla.txt`](turkish/tla.txt) | 384,646 | [kkrypt0nn/wordlists](https://github.com/kkrypt0nn/wordlists) |

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
5. Add it to the table above.
