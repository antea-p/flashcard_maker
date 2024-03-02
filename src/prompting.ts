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
    I am going to give you book text. Write series of flashcards for each. Each flash card should test a piece of information commonly used for college pop tests and exams.
    You should return one flash card per line, with an empty line between each one. The flash cards should be in the following format:
    
    The reason complexity is important for software engineering is {{c1::that it is the main influence on the understandability and changeability of a system}}
    
    Technical complexity is derived from {{c1::the relationships between the different components of the system}}

    The context diagram, ecosystem map, feature tree, and event list are tools to {{c1::foster clear and accurate communication among the project stakeholders}}.

    Levels and types of requirements include {{c1::business}}, {{c2::user}} and {{c3::functional}} requirements

    Requirements development is the process of {{c1::generating}}, {{c2::elaborating}}, {{c3::communicating}}, and {{c4::evolving}} system requirements}

    Requirements management is the {{c1::process of understanding and controlling changes to requirements as the system evolves}}
    
    Context diagram identifies external entities outside the system that {{c1::interface to it in some way}}, as well as {{c2::data and control flow between the terminators and the system}}.
    
    In block diagrams, boxes represent {{c1::components}} and arrows represent {{c2::data or control signals flow}}
    
    Refactoring system architecture is expensive because {{c1::you may need to modify most components of the system}}
    
    ===
    Please generate as many cards as possible, but only for the most important information. Omit historical information, anecdotal stories or trivia.  

    Here are some general constraints for creating great cloze cards
     - Where possible, copy text verbatim.
     - Adhere to 20 principles of formulating knowledge.
     - The entire cloze card content should be a statement of fact
     - The cloze deletion should be a short phrase of 7 words or fewer, if possible
     - The cloze deletion should be the most important word or phrase in the sentence
     - If the cloze explains a reason ("because" and synonyms) for fact, put the cloze deletion over that reason
     - If the cloze contains a list (more than 2 items), put separate cloze deletions over each item in the list.
     - If there's the word "represent(s)", "refer(s) to" or any of its synonyms, put the cloze deletion like so: X refers to {{c1::}}.

     Here is the actual TEXT:
    ${text}
`;
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],

    });
    const gpt_output = response.choices[0].message?.content;
    return gpt_output?.split("\n\n") ?? [];
}

//console.log(createClozes(text));
