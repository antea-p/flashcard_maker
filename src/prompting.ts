import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Generates cloze deletion flashcards from a given text.
 * 
 * @param {string} text The text from which to generate flashcards. It should be a PDF text that's been split into chunks, with each chunk under 16K size.
 * @returns {Promise<string[]>} A promise that resolves to an array of strings, where
 *                              each string represents a formatted cloze flashcard.
 */
export async function createClozes(text: string): Promise<string[]> {
    const prompt = `
    I am going to give you a textbook lesson in Software Architecture. 
    <task>
    Your job is to create as many flashcards as possible (50-150), based on the text alone.
    Each flashcard must be separated from others by an empty line.
    </task>

    <constraints>
    Here are some general constraints for creating great cloze cards:
    - Focus on definitions, processes, reasons, and categorizations. Avoid historical anecdotes and trivia.
    - Ensure the cloze deletion is the most crucial word or phrase, typically no more than 7 words.
    - Use multiple cloze deletions for lists to emphasize the distinct components or steps.
    - If discussing reasons or causations, place the cloze over the causal phrase.
    - It's fine if a card is actually paragraph of related facts, since this may help provide better learning context. Such paragraph may contain up to 5-7 closely related sentence. 
    Each sentence should have its own cloze deletions, i.e. {{c1::}} in sentence 1, {{c2::}} in sentence 2.
    - Avoid redundancies, and ensure no duplicates or overly similar cards. This applies even if the original text has redundancies.
    - Do not include interpretations; stick to facts.
    - Cite page numbers AND chapter names for each card for reference. Always do it in a new line. If applicable, also include subchapter name.
    </constraints>

    <text>
    ${text}
    </text>
`;
    try {
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 4000,
            system: "You are a seasoned software architect with 3 decades of experience, who appreciates Sommerville's work in software engineering.",
            messages: [
                { role: 'user', content: prompt },
                {
                    role: 'assistant', content: `Certainly! I'll create flashcards based on the given text, following the guidelines and example you've provided. Each flashcard will be on a separate line, with an empty line between them.

            Strategija strukturne sistemske analize i strukturnog projektovanja (SSA/SD) omogućava {{c1::konstantno unapređenje metode}} i {{c1::dopunu primijenjenih aktivnosti}}, što je prednost u odnosu na druge dostupne strategije. (Poglavlje 1 - Uvod)

            Metoda projektovanja SSA/SD sastoji se iz dve odvojene ali srodne tehnike: 1. {{c1::strukturna sistemska analiza}} - odnosi se na {{c1::modelovanje funkcija}} 2. {{c2::strukturno projektovanje}} - usmereno na {{c2::aspekte rešavanja problema}} (Poglavlje 1 - Uvod)
            
            Prethodni oblici SSA/SD procesa projektovanja koristili su {{c1::strategiju odozgo-nadole}} za prikazivanje {{c1::toka}} ili {{c1::strukture podataka}}, te su bili usmjereni ka razvoju rešenja koji koristi {{c2::stil poziv-povratak}}. Osnovni identifikovani problem ove metode predstavlja {{c2::obrada podataka}}. (Poglavlje 1 - Uvod)
            
            Dijagrami toka podataka omogućavaju {{c1::problemski orijentisan}} i {{c1::funkcionalni}} pogled koji ne radi pretpostavke {{c1::o hijerarhiji}} (u smislu da su {{c1::svi krugovi na dijagramu "jednaki"}}). (Poglavlje 1 - Reprezentacija strukturne sistemske analize)
            
            Tehnike strukturne sistemske analize usmeravaju projektanta softvera u toku {{c1::kreiranja modela problema}} korišćenjem {{c1::dijagrama toka podataka}} i {{c1::razgrađivanja sistema gde je to neophodno}}, radi osiguranja potrebnog nivoa detalja. (Poglavlje 1 - Reprezentacija strukturne sistemske analize)
            
            Funkcionalna tačka gledišta, dobijena putem {{c1::dijagrama toka podataka}}, može biti dodatno poboljšana upotrebom {{c1::"P-Spec" specifikacije procesa}}. (Poglavlje 1 - Reprezentacija strukturne sistemske analize)
            
            "P-Spec" specifikacija obuhvata: 1. {{c1::naziv procesa}} 2. {{c2::opis procesa}} 3. {{c3::ulazno/izlazne podatke}} 4. {{c4::proceduralne zadatke}} (Poglavlje 1 - Reprezentacija strukturne sistemske analize)
            
            Rečnik podataka obuhvata {{c1::opise svih oblika podataka}} koji su {{c1::navedeni}} u {{c1::dijagramu toka podataka}} ili {{c1::specifikaciji procesa}}. (Poglavlje 1 - Reprezentacija strukturne sistemske analize)
            
            Rečnik podataka mora biti {{c1::apstraktan}}, odnosno ne treba biti {{c1::fokusiran na fizički format}}. (Poglavlje 1 - Reprezentacija strukturne sistemske analize)
            
            Za razliku od različitih oblika predstavljanja strukturne sistemske analize, aktivnosti strukturnog projektovanja primarno koriste {{c1::samo jedan oblik dijagramskog predstavljanja (notacije)}}. Takav prikaz, orijentisan kroz {{c2::stil "poziv-povratak"}}, bavi se opisom {{c2::funkcija podprograma}} uz detaljnu {{c2::hijerarhiju poziva}}. (Poglavlje 2 - Reprezentacija strukturnog projektovanja)
            
            Dopunu dijagramima strukturnog projektovanja moguće je obezbediti kroz: 1. {{c1::ERD dijagrame}} 2. {{c2::tabele odlučivanja}} 3. {{c3::pseudokod}} (Poglavlje 2 - Reprezentacija strukturnog projektovanja)
            
            SSA/SD proces projektovanja ima sledeće korake: 1. Počinje sa {{c1::konstruisanjem modela problema najvišeg nivoa}}. 2. Nakon početnog koraka, {{c2::opis problema}} se {{c2::transformiše u plan programa}}. 3. Tako kreirani {{c3::plan programa}} je opisan kroz {{c3::skup podprograma}} koji se {{c3::koriste za obavljanje relevantnih operacija}} (zajedno sa {{c3::detaljima interakcije između podprograma}}). Opisani oblik procesa projektovanja je detaljniji od {{c4::jednostavne strategije "odozgo na dole"}} jer omogućava {{c4::proširivanje jednostavnog opisa sistema}} (kroz {{c4::operacije}} i {{c4::tok informacija između operacija}}). (Poglavlje 3 - SSA/SD proces projektovanja)
            
            U SSAD/SD metodi, pet osnovnih koraka procesa transformacije su: 1. {{c1::Konstruisanje dijagram toka podataka}} (kroz {{c1::prikaz visokog nivoa}}, tj. {{c1::dijagram konteksta}}) 2. {{c2::Razrada slojevite hijerarhije}} na osnovu {{c2::dobijenog dijagrama toka podataka}} 3. Primena {{c3::analize transakcija}} radi {{c3::podele dijagrama u izdvojene jedinice}} 4. Izvršiti {{c4::analizu transformacije}} na {{c4::dijagramu toka podataka za svaku transakciju}} u cilju dobijanja {{c4::strukturnog grafičkog prikaza}} za {{c4::tu transakciju}} 5. {{c5::Spajanje strukturnih grafika}} u cilju dobijanja {{c5::implementacionog plana}}, te njihovo {{c5::profinjavanje}} i {{c5::kontrola grešaka}} (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Strukturna sistemska analiza je {{c1::problemski orijentisana}} dok strukturno projektovanje predstavlja {{c1::rešenje identifikovanog problema}}. Moguće transformacije procesa projektovanja koje su uključene u SSA/SD metodu omogućavaju formiranje {{c1::skupa sekvencijalnih koraka}} uz {{c1::povratne informacije}} o {{c1::izvršenoj transformaciji}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Cilj strukturne sistemske analize je proizvesti {{c1::funkcionalnu specifikaciju}} koja opisuje {{c1::rad sistema}}, te bi trebala {{c1::ograničiti oblik eventualne implementacije (rešenja problema)}}. (Poglavlje 3 - SSA/SD proces
            Najapstraktniji opis sistema je onaj gde je sistem prikazan kao {{c1::jedan "krug"}} na {{c1::dijagramu konteksta}}, te predstavlja {{c1::proces}} ili {{c1::nulti nivo opisa sistema}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Dijagram konteksta omogućava prikaz {{c1::toka podataka}} koji su {{c1::izvan sistema}} a {{c1::utiču na sistem}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            {{c2::Dijagram konteksta}} je početni korak u procesu projektovanja, a nakon toga se koriste dve strategije: {{c1::odozgo-nadole}} i {{c1::podela događaja}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Strategija odozgo-nadole je tradicionalni pristup u okviru kog je {{c1::dijagram konteksta}} predstavljen kao {{c1::skup funkcionalnih zadataka}}. Nakon toga se {{c2::proces ponavlja}} sve dok {{c2::krugovi ne budu toliko pojednostavljeni}} da mogu biti predstavljeni {{c2::kroz "P-Spec" specifikaciju}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Strategija podela događaja (event-partitioning) {{c1::povezuje akcije}} sa {{c1::svakim događajem}} i {{c2::predstavlja}} ih kroz {{c2::jedan krug}} na {{c2::dijagramu toka podataka}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            U procesu izrade dijagrama toka podataka, projektant treba da modeluje: 1. {{c1::fizičke DTD-ove}} koji opisuju {{c1::početni model sistema}} za {{c1::konkretne stavke (npr. imena korisnika)}} 2. {{c2::logičke DTD-ove}} koji prikazuju {{c2::apstraktne pojmove}} koji opisuju {{c2::operacije}} i {{c2::protok podataka}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Korak 3 - analiza transakcije. Glavna akcija unutar ovog koraka je {{c1::razdvajanje komponenti "velikog projektovanja sistema"}} na {{c1::mrežu međusobno povezanih podsistema}} i {{c1::transakcija između njih}}. Tako {{c2::grupisane komponente dijagrama toka podataka}} se koriste kao {{c2::ulaz za korak 4 - analizu transformacije}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Transakcija ima pet osnovnih komponenti: 1. {{c1::događaj}} u {{c1::sistemskom okruženju}} koji predstavlja {{c1::uzrok transakcije}} 2. {{c2::stimulus}} koji se {{c2::primenjuje na sistem}} i {{c2::obaveštava ga o događaju}} 3. {{c3::aktivnost}} koju {{c3::sistem izvršava}} kao {{c3::rezultat stimulusa}} 4. {{c4::odgovor}} koji se {{c4::generiše kao izlaz (output) sistema}} 5. {{c5::efekat}} koji {{c5::ima na okruženje}} (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Korak 4 - analiza transformacije. Analiza transformacije vrši konverziju {{c1::nehijerarhijskog DTD-a}} koji opisuje {{c1::identifikovani problem}}, u {{c1::hijerarhijski strukturni grafik}} koji opisuje {{c1::strukturu programa}}. (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Analiza transformacije se vrši u sledećim koracima: 1. Projektant najprije identifikuje {{c2::operacije (krugove DTD-a)}} koje deluju kao {{c2::centralne transformacije}}. {{c2::Centralna transformacija}} predstavlja krug koji se nalazi {{c2::u centru ulaznog i izlaznog toka podataka}}. 1.1. Ako ne postoji {{c3::tačka centralne transformacije}}, projektant može {{c3::dodati krug}} koji će {{c3::je predstavljati}}. 2. {{c4::Krug centralne transformacije}} se {{c4::podiže na vrh DTD-a (kao balon)}}, dok {{c4::drugi krugovi "vise" sa njega}}. 3. {{c5::Centralna transformacija}} se pretvara u {{c5::glavno telo programa}}. {{c5::Operacije}} postaju {{c5::potprogrami}}, dok {{c5::strelice toka podataka}} postaju {{c5::strelice toka kontrole}} (uz moguću {{c5::promenu smera}}). (Poglavlje 3 - SSA/SD proces projektovanja)
            
            Poslednji korak 5 u SSA/SD procesu projektovanja obuhvata {{c1::povezivanje grafičkih prikaza modelovanih dijagrama}}, uz {{c1::rešavanje njihove neusklađenosti}}. (Poglavlje 3 - SSA/SD proces projektovanja, str. 14)
            
            U koraku 5, povezivanje može uključivati i {{c1::dodavanje novih modula}} ili {{c1::izmenu transakcija}}. (Poglavlje 3 - SSA/SD proces projektovanja, str. 14)
            
            Drugi korak predstavlja kreiranje početnog {{c1::dijagrama toka podataka}} koji prikazuje {{c1::ulazne parametre}} i {{c1::procedure koje se izvršavaju}} u okviru sistema. (Poglavlje 3 - SSA/SD proces projektovanja, str. 15)
            
            JSP predstavlja {{c1::programski orijentisanu}} metodu koja primenjuje {{c1::kompozicionu strategiju projektovanja}}. Koristi se za projektovanje sistema zasnovanih na {{c1::stilu cevi i filtera}}. (Poglavlje 4 - Jackson strukturno programiranje (JSP), str. 20)
            
            Strategija podela događaja može biti: 1. {{c1::kompozicijska}} - {{c1::srodne funkcionalnosti}} se {{c1::grupišu zajedno}} kako bi se formirao {{c1::viši nivo DTD-a}} 2. {{c2::dekompozicijska}} - primena {{c2::strategije odozgo-nadole}} za {{c2::precizniji opis}} (Poglavlje 3 - SSA/SD proces projektovanja)
            
             <thinking>Now, I'll continue generating 75-130 flashcards based on the text you've provided. I'll make sure to decide whether to put a single sentence on card, or to organise related facts into coherent paragraphs.
             The decision will be made on what is less likely to confuse a person who is unfamiliar with the topic discussed in the lesson. For the software architecture lessons, I am going to have preference towards paragraphs, in at least 50% of flashcards.</thinking>`
                }
            ],
            temperature: 0.001,
        });

        const claude_output = response.content[0].type === 'text' ? response.content[0].text : '';
        return claude_output.split("\n\n").filter((line: string) => line.trim() !== '');
    } catch (error) {
        console.error('Error generating flashcards:', error);
        throw error;
    }
}
