# Intro 

**Flashcard maker** is a simple TypeScript application which reads a PDF file, and then uses GPT-4 to generate great cloze flashcards. Thanks to use of certain prompting rules, the clozes are placed strategically over the most important fact in the card - at least, most of the time! Meanwhile, it ignores paragraphs discussing historical information, trivia, and similar. These 2 features - smart cloze placement, and omitting irrelevant details - distinguishes the application from existing third-party solutions.

# Instructions
1. Clone the project:
`git clone https://github.com/antea-p/flashcard_maker.git``
2. If not already installed, install `ts-node` package. Then, navigate to the project's root directory, open your terminal, and get the rest of the dependencies by executing:
`npm install`
3. Create .env file with following contents:
`OPENAI_ACCESS_KEY=YOUR_OPENAI_TOKEN_GOES_HERE`
4. In index.ts, change the following line:
```typescript
const filePath = `RELATIVE_OR_ABSOLUTE_PATH_TO_YOUR_PDF`;
```
5. Execute the following command:
`npx ts-node index.ts`

**Note**: Keep in mind that each time you execute the script, your old output.csv will be overwritten with fresh data! If you want to avoid this, please change the following line:
```typescript
console.log(await writeCsv('output.csv', allClozes));
```