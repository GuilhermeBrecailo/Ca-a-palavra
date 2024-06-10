import { useState, useCallback, useEffect } from "react";

// css
import "./App.css";

//componentes
import StartScreen from "./components/StartScreen";
import GameOver from "./components/GameOver";
import Game from "./components/Game";

// data

import { wordsList } from "./data/words";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 5;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCaregory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  // starts the secret word game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();
    //pick word and pick category
    const { word, category } = pickWordAndCategory();

    // create an array of letters

    let wordLetters = word.split("");

    //wordLetters = wordLetters.map((1) => 1.toLowerCase());
    //wordLetters = wordLetters.map((letter) => lerr.toLowerCase());
    wordLetters = wordLetters.map((letter) => letter.toLowerCase());

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // precess the letter input
  const verifyLetter = (letter) => {
    const normalizesLetter = letter.toLowerCase();
    // checando se as letras ja foram utilizadas para o usuario nao eprder uma tentativa com as letras que ja foram utilizadas
    if (
      guessedLetters.includes(normalizesLetter) ||
      wrongLetters.includes(normalizesLetter)
    ) {
      return;
    }
    // push guessed letter or remove a guess
    if (letters.includes(normalizesLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizesLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizesLetter,
      ]);

      setGuesses((actualGuessedLetters) => actualGuessedLetters - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // cheack win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // win codition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => (actualScore += 100));
      // restar game with new word

      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCaregory={pickedCaregory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
