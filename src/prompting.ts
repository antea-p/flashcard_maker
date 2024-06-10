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
    - For sentences of type "X refers to Y" (or similar), put the cloze like this: "X refers to {{c1::Y}}". 
    - Avoid redundancies and ensure no duplicates or overly similar cards.
    - Do not include interpretations; stick to facts.
    - Cite page numbers AND chapter names for each card for reference. Always do it in a new line.

    An example of great Anki deck:
    START OF DECK
    "Konektor za ""objavljivanje-pretplatu"" omogućava {{c1::obaveštavanje}} i {{c1::objavljivanje asinhronih događaja}}. (Poglavlje 1 - Pogled komponente i konektora)"				
    Neformalna notacija podrazumeva upotrebu {{c1::kutija}} i {{c1::linija}}. Prikaz softverske arhitekture može se unaprediti {{c1::detaljnim opisom komponenti i konektora}}. (Poglavlje 1 - Notacije pogleda komponente i konektora)				
    Prikaz konektora podrazumeva da projektant softvera definiše {{c1::smer strelica konektora}}. (Poglavlje 1 - Notacije pogleda komponente i konektora)				
    UML port može biti obeležen {{c1::brojem}}, što se obično vrši samo na {{c1::tipovima komponenti}}. (Poglavlje 1 - Notacije pogleda komponente i konektora)				
    Prikaz interfejsa kroz UML jezik omogućava predstavljanje interfejsa na {{c1::portovima komponenti}}. (Poglavlje 1 - Notacije pogleda komponente i konektora)				
    Konektor između dve komponente u UML jeziku prikazuje se {{c1::jednostavnom linijom}}. (Poglavlje 1 - Notacije pogleda komponente i konektora)				
    Uloga konektora ne može biti eksplicitno predstavljena u UML notaciji, jer {{c1::element konektora}} ne {{c1::uključuje prikaz interfejsa}}, {{c1::za razliku od UML simbola porta}} koji {{c1::omogućava prikaz interfejsa komponente}}. Preporučuje se da se {{c2::označi kraj konektora}} i {{c2::tako identifikuje opis uloga samog konektora}}. (Poglavlje 1 - Notacije pogleda komponente i konektora)				
    Pogled komponenta i konektor može biti korišćen zajedno sa {{c1::pogledom na module}}. (Poglavlje 1 - Relacije pogleda komponente i konektora sa drugim pogledima)				
    Stilovi toka podataka omogućavaju model u kome se komponente prikazuju kao {{c1::transformatori podataka}}. (Poglavlje 2 - Stilovi toka podataka)				
    Najpoznatiji stil toka podataka je {{c1::stil cevi i filtera}}. (Poglavlje 2 - Stilovi toka podataka)				
    Stilovi softverske arhitekture poziv-povratak predstavljaju model gdje komponente {{c1::pružaju skup usluga}}. (Poglavlje 2 - Stil poziv-povratak)				
    Primeri stilova poziv-povratak su {{c1::klijent-server}}, {{c2::peer to peer}}, i {{c3::REST}} stilovi. (Poglavlje 2 - Stil poziv-povratak)				
    Stil peer-to-peer omogućava da komponente {{c1::direktno komuniciraju}} kao {{c1::komponente na istom nivou}}. (Poglavlje 2 - Stil peer-to-peer)				
    Stilovi zasnovani na događajima omogućavaju komunikaciju između komponenata korišćenjem {{c1::asinhronih poruka}}. (Poglavlje 2 - Stil zasnovan na događaju)				
    Jedna komponenta (filter) može isporučiti obrađene podatke na {{c1::jedan ili na nekoliko izlaznih portova}}. (Poglavlje 3 - Stil cevi i filtera)				
    Stil cevi i filtera najčešće se koristi u sistemima za {{c1::transformaciju podataka}}. (Poglavlje 3 - Stil cevi i filtera)				
    Stil klijent-server predstavlja sistemski prikaz koji {{c1::razdvaja}} {{c1::klijentske aplikacije}} od {{c1::usluga koje koriste}}. (Poglavlje 4 - Stil klijent-server)				
    Serveri mogu pružati skup usluga preko {{c1::jednog ili više portova}}, gdje {{c1::svaki port opisuje usluge koje pruža}}. (Poglavlje 4 - Stil klijent-server)				
    Konektor koji se koristi u stilu klijent-server je {{c1::konektor za upit/odgovor}}. (Poglavlje 4 - Stil klijent-server)				
    Klijenti imaju portove koji opisuju {{c1::usluge koje zahtevaju}}. (Poglavlje 4 - Stil klijent-server)				
    Prednosti stila klijent-server: 1. podržava {{c1::ponovnu upotrebu komponenti}} za {{c1::zajedničke usluge}} 2. {{c2::serveri mogu biti replicirani}} radi {{c2::poboljšanja skalabilnosti ili dostupnosti}} 3. {{c3::serverima može pristupiti bilo koji broj klijenata}} 4. relativno je lako {{c4::dodati nove klijente u softversku arhitekturu}} (Poglavlje 4 - Stil klijent-server)				
    Tipovi komponenti u stilu peer-to-peer su {{c1::peer-ovi}} koji su uglavnom {{c1::nezavisni programi}}. (Poglavlje 5 - Stil peer-to-peer)				
    Tip konektora koji se koristi u stilu peer-to-peer je {{c1::konektor poziv-povratak}}. (Poglavlje 5 - Stil peer-to-peer)				
    Razlika između klijent-server stila i peer-to-peer stila je da {{c1::u potonjem, bilo koja komponenta može inicirati interakciju}}. (Poglavlje 5 - Stil peer-to-peer)				
    Servisno-orijentisana arhitektura omogućava sledeće infrastrukturne usluge: 1. {{c1::usmeravanje poruka}}, 2. {{c2::pretvaranje poruka}}, 3. {{c3::transformacije podataka}} (Poglavlje 6 - Servisno-orijentisani stil)				
    {{c2::Servisni registri}} omogućavaju {{c1::registraciju}} i {{c1::pretraživanje usluga}} {{c1::tokom izvršavanja}}. (Poglavlje 6 - Servisno-orijentisani stil)				
    Servisno-orijentisana arhitektura nudi potrebne elemente za {{c1::interakciju sa eksternim uslugama dostupnim preko interneta}}. (Poglavlje 6 - Servisno-orijentisani stil)				
    Stil objavi-pretplati se koristi za {{c1::slanje događaja nepoznatom skupu primaoca}}. Odnosno, posiljatelj ne mora {{c1::poznavati skup primaoca}}. (Poglavlje 7 - Stil objavi-pretplati se)				
    Primena stila objavi-pretplati se zavisi od {{c1::performansi infrastrukture sistema}}. (Poglavlje 7 - Stil objavi-pretplati se)				
    Glavni oblik konektora u stilu objavi-pretplati se je {{c1::magistrala}}. (Poglavlje 7 - Stil objavi-pretplati se)				
    Stilovi skladišta sadrže jednu ili više komponenti koje se zovu {{c1::skladišta (repozitorijumi)}}. Ostale komponente stila skladišta {{c1::čitaju}} i {{c1::upisuju podatke}} u {{c1::skladišta}}.  {{c2::Pristup}} može biti {{c2::transakcion}} i {{c2::autentificiran}}. (Poglavlje 8 - Stil deljenih podataka) (Poglavlje 8 - Stil deljenih podataka)				
    Stil skladišta omogućava  1. {{c1::pristupačnost podataka}} 2. {{c2::obaveštavanje drugih komponenti}} o {{c2::izmenama podataka}} (Poglavlje 8 - Stil deljenih podataka)				
    {{c2::Servisni poziv}} može {{c1::usmeravati poruke između potrošača usluga}} i {{c1::pružaoca usluga}}. (Poglavlje 6 - Servisno-orijentisani stil)				
    Transparentnost lokacije pružaoca usluga omogućava {{c1::povećanje mogućnosti proširivanja}}. (Poglavlje 6 - Servisno-orijentisani stil)				
    {{c3::Server za orkestraciju}}: 1. {{c1::pokreće interakciju između različitih potrošača i proizvođača usluga}} 2. {{c2::izvršava skripte nakon pojave određenog događaja}}  (Poglavlje 6 - Servisno-orijentisani stil)				
    U stilu deljenih podataka, DBMS obezbeđuje {{c1::interfejs}} za {{c1::povratni poziv}} za {{c1::preuzimanje}} i {{c1::manipulaciju}} {{c1::podacima}}. (Poglavlje 8 - Stil deljenih podataka)				
    END OF DECK

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
        temperature: 0.01, // Lowered to reduce creativity

    });
    const gpt_output = response.choices[0].message?.content;
    return gpt_output?.split("\n\n") ?? [];
}

//console.log(createClozes(text));
