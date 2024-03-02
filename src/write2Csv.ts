import { writeFileSync } from 'fs';
import Papa from 'papaparse';

/**
 * Writes an array of clozes to a CSV file with a semicolon separator.
 *
 * @param filename The name of the file to write to.
 * @param clozes An array of strings, each representing a cloze.
 */
export async function writeCsv(filename: string, clozes: string[]): Promise<void> {
    // Directly use clozes array for Papa Parse without transforming into objects
    const csv = Papa.unparse(
        clozes.map(cloze => ({ cloze })),
        {
            delimiter: ';', // Use semicolon as delimiter
            header: false, // No header row required
        }
    );

    // Write CSV string to file using Node.js fs module
    try {
        writeFileSync(filename, csv);
        console.log(`CSV file has been written to ${filename}`);
    } catch (error) {
        console.error('Error writing CSV file:', error);
    }
}
