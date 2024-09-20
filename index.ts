import { extractPdfText, splitTextPreservingContext } from "./src/extractPdfText";
import { createClozes } from "./src/prompting";
import { writeCsv } from "./src/write2Csv";

const filePath = '/your/path/to/pdf';

async function main() {
    try {
        const text = await extractPdfText(filePath);
        const split_text = splitTextPreservingContext(text, 32000);
        const allClozes = [];

        for (let chunk of split_text) {
            const clozes = await createClozes(chunk);
            console.log(`Clozes generated: ${clozes.length}\n----------`);
            allClozes.push(...clozes);

            // Respect rate limits (5 requests per minute)
            await new Promise(resolve => setTimeout(resolve, 12000));
        }

        await writeCsv('clozes.csv', allClozes);
        console.log(`Total clozes generated: ${allClozes.length}`);
    } catch (error) {
        console.error(error);
    }
}

main();
