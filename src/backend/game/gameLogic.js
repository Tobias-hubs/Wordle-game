//Code from previous project Testade-algorithmer

export function controllGuess(guess, correctWord) { 
    let feedback = [];
    
    for(let i = 0; i < guess.length; i++)  {
        let letter = guess[i];

        if (letter === correctWord[i]) {
            feedback.push({letter, result: "correct"});
        } else { 
            feedback.push({letter, result: null });
        }
    }

    for (let i = 0; i < guess.length; i++) {
        if(feedback[i].result === null) {
            const letter = guess[i];
            if (correctWord.includes(letter)) {
                feedback[i].result = "misplaced";
            } else {
                feedback[i].result = "wrong";
        }
      } 
    }   

    // Check if guess i completely correct
    const isGameOver = feedback.every(f => f.result === "correct");

    return {feedback, isGameOver}; 

   
}

export function chooseWord(wordList, length, specialLetters)   {

    let validWords = wordList.filter(word => word.length === length);
    
   
    if (validWords.length === 0) {
        return `There are no words with ${length} letters`; 
    }

    if (!specialLetters) {
       validWords = validWords.filter(word => new Set(word).size === word.length);
        
    }
    
    const randomIndex = Math.floor(Math.random() * validWords.length);
        return validWords[randomIndex];
    
}

