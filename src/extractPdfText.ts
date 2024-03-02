import * as fs from 'fs';
import pdf from 'pdf-parse';

export const extractPdfText = async (filePath: string): Promise<string> => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error reading PDF:', error);
        return '';
    }
};

export function splitTextPreservingContext(text: string, targetSize: number, tolerance: number = 0.1): string[] {
    const minSize = targetSize * (1 - tolerance); // 10% smaller
    const maxSize = targetSize * (1 + tolerance); // 10% larger
    const result: string[] = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
        let endIndex = currentIndex + targetSize;
        if (endIndex > text.length) {
            // If we're at the end of the text, just push the rest
            result.push(text.substring(currentIndex));
            break;
        }

        // Adjust endIndex to not split in the middle of a word
        while (endIndex < text.length && text[endIndex] !== ' ' && text[endIndex - 1] !== ' ') {
            endIndex++;
        }

        // Try to find the closest paragraph break within the tolerance range
        let paragraphEnd = endIndex;
        while (paragraphEnd < text.length && paragraphEnd < currentIndex + maxSize && text[paragraphEnd] !== '\n') {
            paragraphEnd++;
        }
        while (paragraphEnd > currentIndex && paragraphEnd > currentIndex + minSize && text[paragraphEnd] !== '\n') {
            paragraphEnd--;
        }

        // If we found a paragraph end within the range, use it; otherwise, stick with the closest word end
        if (paragraphEnd > currentIndex + minSize && paragraphEnd < currentIndex + maxSize) {
            endIndex = paragraphEnd;
        }

        result.push(text.substring(currentIndex, endIndex).trim());
        currentIndex = endIndex + 1; // Skip the paragraph break or space
    }

    return result;
}



