import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_ACCESS_KEY
});

/**
 * Generates cloze deletion flashcards from a given text using the OpenAI API.
 * 
 * @param {string} text The text from which to generate flashcards. It should be a PDF text that's been split into chunks, with each chunk under 16K size.
 * @returns {Promise<string[]>} A promise that resolves to an array of strings, where
 *                              each string represents a formatted cloze flashcard.
 */
export async function createClozes(text: string): Promise<string[]> {
    const prompt = `
    I am going to give you a textbook lesson in Software Architecture. Your job is to create as many flashcards as possible (50-150), based on the text alone.
    You should return one flashcard per line, with an empty line between each one.
    The flashcards should be like the examples between FORMAT and TEXT.

    Here are some general constraints for creating great cloze cards:
    - Focus on definitions, processes, reasons, and categorizations. Avoid historical anecdotes and trivia.
    - Ensure the cloze deletion is the most crucial word or phrase, typically no more than 7 words.
    - Use multiple cloze deletions for lists to emphasize the distinct components or steps.
    - If discussing reasons or causations, place the cloze over the causal phrase.
    - For terms that involve references or representations, use the format: X refers to {{c1::}}.
    - Avoid redundancies and ensure no duplicates.
    - Do not include interpretations; stick to facts.
    - Cite page numbers and chapter names for each card for reference.

    Example:
    Technical complexity is derived from {{c1::the relationships}} between {{c1::the different components of the system}}.
    Requirements development is the process of:
    1. {{c1::generating}},
    2. {{c2::elaborating}},
    3. {{c3::communicating}},
    4. {{c4::evolving}} system requirements.
    A generic ERP system includes {{c1::a number of modules}} that may be {{c1::composed in different ways}} to {{c1::create a system for a customer}}.
    Requirements management is the {{c1::process of understanding}} and {{c1::controlling changes to requirements}} as {{c1::the system evolves}}.
    Context diagram identifies external entities outside the system that {{c1::interface to it in some way}}, as well as {{c2::data and control flow between the terminators and the system}}.
    In block diagrams, boxes represent {{c1::components}} and arrows represent {{c2::data or control signals flow}}.
    Refactoring system architecture is expensive because {{c1::you may need to modify most components of the system}}.
    TEXT:
    ${text}
`;
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.3, // Lowered to reduce creativity

    });
    const gpt_output = response.choices[0].message?.content;
    return gpt_output?.split("\n\n") ?? [];
}

//console.log(createClozes(text));
