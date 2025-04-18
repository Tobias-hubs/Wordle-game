import { chooseWord, controllGuess } from './gameLogic.js';

describe("controllGuess - Test of feedback results", () => {

    
    // Test that check that some letters are correct, some are misplaced and some are wrong
    test("should return correct feedback", () => { 
    const result = controllGuess("CYKLA", "HALLÅ");
    expect(result.feedback).toEqual([
        {letter: "C", result: "wrong"}, // Does not exist in "HALLÅ"
        {letter: "Y", result: "wrong"}, // Does not exist in "HALLÅ"
        {letter: "K", result: "wrong"}, // Does not exist in "HALLÅ"
        {letter: "L", result: "correct"},   // Do exist in "HALLÅ" and is on the correct place
        {letter: "A", result: "misplaced"} // Do exist in "HALLÅ" but is on the wrong place
    ]);
});

// Test scenario where all letters are correct and in the right place
test("should return correct feedback for a completely correct guess", () => {
    const result = controllGuess("HALLÅ", "HALLÅ");
    expect(result.feedback).toEqual([
        {letter: "H", result: "correct"}, // Correct letter and placement
        {letter: "A", result: "correct"}, // Correct letter and placement
        {letter: "L", result: "correct"}, // Correct letter and placement
        {letter: "L", result: "correct"}, // Correct letter and placement
        {letter: "Å", result: "correct"} // Correct letter and placement
    ]);
});

// Test when all letters are wrong
test("should return wrong feedback when no letters are correct", () => {
    const result = controllGuess("ABCDE", "GÅ");
    expect(result.feedback).toEqual([  
        {letter: "A", result: "wrong"}, // Does not exist in "GÅ"
        {letter: "B", result: "wrong"}, // Does not exist in "GÅ"
        {letter: "C", result: "wrong"}, // Does not exist in "GÅ"
        {letter: "D", result: "wrong"}, // Does not exist in "GÅ"
        {letter: "E", result: "wrong"} // Does not exist in "GÅ"

    ]);
});
});



describe("chooseWord - Test of the word selection", () => {     
 
    // Test that checks that the word has correct length, HEJ and BIL has 3 letters and is true
    test("should return a word of correct length", () => {
    const wordList = ["HALLÅ", "CYKLA", "HEJ", "CYKEL", "BIL"];
    const result = chooseWord(wordList, 3, true);
    expect(result).toHaveLength(3);

    });

    // Test that check for unique letters only, HEJ and BIL has unique letters 
    test("should return a word where all letters are unique if requried", ()   => {
        const wordList =  ["HALLÅ", "CYKLA", "HEJ", "CYKEL", "BIL"];
        const result = chooseWord(wordList, 3, false);
        expect(new Set(result).size).toBe(result.length);
    });

    // Test that checks if no words match with length 2 and is true
    test("should check cases where no words match", () => {
        const wordList = ["HALLÅ", "CYKLA", "HEJ", "CYKEL", "BIL"];
        const result = chooseWord(wordList, 2, true); // No words with 2 letters
        expect(result).toBe("There are no words with 2 letters");
    });

});
    
    