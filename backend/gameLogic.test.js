// const { chooseWord, controllGuess } = require('./game/gameLogic.js');
import { chooseWord, controllGuess } from './game/gameLogic.js';


describe("controllGuess - Test of feedback results", () => {

    // Test that check that some letters are correct, some are misplaced and some are incorrect
    test("should return correct feedback", () => { 
    const result = controllGuess("CYKLA", "HALLÅ");
    expect(result).toEqual([
        {letter: "C", result: "incorrect"}, // Does not exist in "HALLÅ"
        {letter: "Y", result: "incorrect"}, // Does not exist in "HALLÅ"
        {letter: "K", result: "incorrect"}, // Does not exist in "HALLÅ"
        {letter: "L", result: "correct"},   // Do exist in "HALLÅ" and is on the correct place
        {letter: "A", result: "missplaced"} // Do exist in "HALLÅ" but is on the wrong place
    ]);
});

// Test scenario where all letters are correct and in the right place
test("should return correct feedback for a completely correct guess", () => {
    const result = controllGuess("HALLÅ", "HALLÅ");
    expect(result).toEqual([
        {letter: "H", result: "correct"}, // Correct letter and placement
        {letter: "A", result: "correct"}, // Correct letter and placement
        {letter: "L", result: "correct"}, // Correct letter and placement
        {letter: "L", result: "correct"}, // Correct letter and placement
        {letter: "Å", result: "correct"} // Correct letter and placement
    ]);
});

// Test when all letters are incorrect
test("should return incorrect feedback when no letters are correct", () => {
    const result = controllGuess("ABCDE", "GÅ");
    expect(result).toEqual([  
        {letter: "A", result: "incorrect"}, // Does not exist in "GÅ"
        {letter: "B", result: "incorrect"}, // Does not exist in "GÅ"
        {letter: "C", result: "incorrect"}, // Does not exist in "GÅ"
        {letter: "D", result: "incorrect"}, // Does not exist in "GÅ"
        {letter: "E", result: "incorrect"} // Does not exist in "GÅ"

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
    
    