import { extractPdfText, splitTextPreservingContext } from "./src/extractPdfText";
import { createClozes } from "./src/prompting";
import { writeCsv } from "./src/write2Csv";

const filePath = '/home/boone/Metropolitan/Treca godina/SE322/SE322-L10.pdf';

async function main() {
    try {
        const text = await extractPdfText(filePath);
        const split_text = splitTextPreservingContext(text, 12288);
        const allClozes = [];

        for (let chunk of split_text) {
            const clozes = await createClozes(chunk);
            console.log(`Clozes generated:\n${clozes}\n----------`)
            allClozes.push(...clozes);
        }

        console.log(await writeCsv('output.csv', allClozes));
    } catch (error) {
        console.error(error);
    }
}

main();
