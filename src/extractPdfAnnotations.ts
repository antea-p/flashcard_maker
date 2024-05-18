import * as fs from 'fs';
import { writeCsv } from './write2Csv';

const fileContents = fs.readFileSync("/home/boone/pythonVenv/bin/annotations3.txt").toString();
const notes = fileContents.split("*").slice(1);

const extractContentFromNote = (note: string): string | undefined => {
    const contentStartIndex = note.indexOf(':');
    if (contentStartIndex === -1) return undefined;
    const contentPart = note.substring(contentStartIndex + 1).trim();
    const match = contentPart.match(/"([^"]+)"|>([\s\S]+)/);
    return match ? (match[1] || match[2]).trim() : undefined;
};

const highlights = notes.map(extractContentFromNote).filter((note): note is string => note !== undefined);

console.log(`Total extracted annotations: ${highlights.length}`);
console.log(highlights);

writeCsv('output2.csv', highlights).then(() => {
    console.log('CSV file has been successfully written.');
}).catch((error) => {
    console.error('Failed to write CSV:', error);
});
