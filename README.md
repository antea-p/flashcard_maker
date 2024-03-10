# Intro 

**Flashcard maker** is a simple TypeScript application which reads a PDF file, and then uses GPT-4 to generate Anki-compatible cloze flashcards (as CSV file). Thanks to use of carefully crafted prompting rules, the clozes are placed over the most important fact in the card - at least, most of the time! Meanwhile, it ignores paragraphs discussing historical information, trivia, and similar. These 2 features - smart cloze placement, and omitting irrelevant details - distinguishes the application from existing third-party solutions.

# Instructions
1. Clone the project:
```bash
git clone https://github.com/antea-p/flashcard_maker.git
```
3. If not already installed, install `ts-node` package. Then, navigate to the project's root directory, open your terminal, and get the rest of the dependencies by executing:
```bash
npm install
```
4. Create .env file with following contents:
`OPENAI_ACCESS_KEY=YOUR_OPENAI_TOKEN_GOES_HERE`
5. In index.ts, change the following line:
```typescript
const filePath = `RELATIVE_OR_ABSOLUTE_PATH_TO_YOUR_PDF`;
```
5. Execute the following command:
```bash
npx ts-node index.ts
```

**Note**: Keep in mind that each time you execute the script, your old output.csv will be overwritten with fresh data! If you want to avoid this, please change the following line:
```typescript
console.log(await writeCsv('output.csv', allClozes));
```
6. Open Anki, and select any deck you wish. Then, go to File --> Import..., and select your CSV file. In new dialog, change Field separator to Semicolon. Use of [Enhanced Cloze](https://ankiweb.net/shared/info/1990296174) as your Note Type is highly recommended, though optional.
![image](https://github.com/antea-p/flashcard_maker/assets/147252486/cff21118-36a9-4fbc-aae2-1334da85e8a1)
