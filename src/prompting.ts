import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_ACCESS_KEY
});

const text = `
The models described in this section can be used to represent project scope in various ways. You
don’t need to create all of these models; consider which ones provide the most useful insight for
each project. The models can be included in the vision and scope document or stored elsewhere and
referenced as needed.
The purpose of tools such as the context diagram, ecosystem map, feature tree, and event list
is to foster clear and accurate communication among the project stakeholders. That clarity is more
important than dogmatically adhering to the rules for a “correct” diagram. We strongly recommend,
though, that you adopt the notations illustrated in the following examples as standards for drawing
the diagrams. For example, in a context diagram, suppose you were to use a triangle to represent the
system instead of a circle, and ovals rather than rectangles for external entities. Your colleagues would
have difficulty reading a diagram that follows your personal preferences rather than a team standard.
Context diagrams, ecosystem maps, feature trees, and event lists are the most common ways
to represent scope visually. However, other techniques are also used. Identifying affected ­business
­processes also can help define the scope boundary. Use case diagrams can depict the scope boundary
between use cases and actors (see Chapter 8, ­“Understanding user requirements”).
92
Context diagram
The scope description establishes the boundary and connections between the system you’re
­developing and everything else in the universe. The context diagram visually illustrates this boundary.
It identifies external entities (also called terminators) outside the system that interface to it in some
way, as well as data, control, and material flows between the terminators and the system. The context
diagram is the top level in a data flow diagram developed according to the principles of structured
analysis (Robertson and Robertson 1994), but it’s a useful model for all projects.
PART II Requirements development
Figure 5-6 illustrates a portion of the context diagram for the Chemical Tracking System. The
entire system is depicted as a single circle; the context diagram deliberately provides no visibility
into the system’s internal objects, processes, or data. The “system” inside the circle could ­encompass
any combination of software, hardware, and human components. Therefore, it could include manual
­operations as part of the entire system. The external entities in the rectangles can represent user
classes (Chemist, Buyer), organizations (Health and Safety Department), other systems (Training
­Database), or hardware devices (Bar Code Reader). The arrows on the diagram represent the flow of
data (such as a request for a chemical) or physical items (such as a chemical container) between the
system and its external entities.
You might expect to see chemical vendors shown as an external entity in this diagram. After all,
the company will route orders to vendors for fulfillment, the vendors will send chemical containers
and invoices to Contoso Pharmaceuticals, and Contoso’s purchasing department will pay the vendors.
However, those processes take place outside the scope of the Chemical Tracking System, as part of
the operations of the purchasing and receiving departments. Their absence from the context diagram
makes it clear that this system is not directly involved in placing orders with the vendors, receiving the
products, or paying the bills.
`

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

console.log(createClozes(text));
