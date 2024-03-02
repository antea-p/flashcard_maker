# Intro 

**Flashcard maker** is a simple TypeScript application which reads a PDF file, and then uses GPT-4 to generate great cloze flashcards. Thanks to use of certain prompting rules, the clozes are placed strategically over the most important fact in the card - at least, most of the time! Meanwhile, it ignores paragraphs discussing historical information, trivia, and similar. These 2 features - smart cloze placement, and omitting irrelevant details - distinguishes the application from existing third-party solutions.

# Instructions
1. Clone the project.
2. Create .env file with following contents:
`OPENAI_ACCESS_KEY=YOUR_OPENAI_TOKEN_GOES_HERE`
3. In index.ts, change 
```typescript
const filePath = `RELATIVE_OR_ABSOLUTE_PATH_TO_YOUR_PDF`;
```
4. In terminal, execute the following command (Make sure you are in the project root directory!):
`npx ts-node index.ts`
