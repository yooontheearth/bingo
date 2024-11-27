import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { useImmer } from 'use-immer'
import clsx from 'clsx';

const initialCandidateNumbers = [...Array(75).keys()].map(i => i + 1);

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function App() {
  const [candidateNumbers, updateCandidateNumbers] = useImmer<number[]>(initialCandidateNumbers)
  const [chosenNumbers, updateChosenNumbers] = useImmer<number[]>([])
  const [currentNumber, updateCurrentNumber] = useState<number>(0)
  const [isAnimating, setIsAnimating] = useState(false);

  function onNextNumberClick(){
    if(candidateNumbers.length === 0){
      alert('もう数字がないよ。リセットしてね！')
      return
    }
      
    const index = getRandomNumber(0, candidateNumbers.length-1)
    const number = candidateNumbers[index]
    updateCurrentNumber(number)
    updateChosenNumbers(draft => {draft.unshift(number)})
    updateCandidateNumbers(draft => draft.filter((_, i) => i !== index))
  }

  function onResetClick(){
    updateCurrentNumber(0)
    updateChosenNumbers([])
    updateCandidateNumbers(initialCandidateNumbers)
  }

  // Trigger animation
  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timeout)
  }, [currentNumber]);

  useEffect(() => {
    const storedCandidateNumbers = localStorage.getItem("candidateNumbers")
    const storedChosenNumbers = localStorage.getItem("chosenNumbers")
    const storedCurrentNumber = localStorage.getItem("currentNumber")

    if (storedCandidateNumbers) {
      updateCandidateNumbers(JSON.parse(storedCandidateNumbers))
    }
    if (storedChosenNumbers) {
      updateChosenNumbers(JSON.parse(storedChosenNumbers))
    }
    if (storedCurrentNumber) {
      updateCurrentNumber(Number(storedCurrentNumber))
    }
  }, [updateCandidateNumbers, updateChosenNumbers, updateCurrentNumber])

  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem("candidateNumbers", JSON.stringify(candidateNumbers))
      localStorage.setItem("chosenNumbers", JSON.stringify(chosenNumbers))
      localStorage.setItem("currentNumber", currentNumber.toString())
    };

    window.addEventListener("beforeunload", handleUnload)

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [candidateNumbers, chosenNumbers, currentNumber])

  return (
    <>
      <header>
          <button 
            className={styles.button}
            onClick={onNextNumberClick}>次（残り<span>{candidateNumbers.length}</span>）</button>
      </header>
      <div className={styles.numberContainer}>
        <div className={styles.currentNumber}>
            <div className={clsx(isAnimating && styles.fadeIn)}>{currentNumber > 0 && currentNumber}</div>
        </div>
        <div className={styles.chosenNumbers}>
          {chosenNumbers.filter(num => num !== currentNumber).map(num => <div key={num}>{num}</div>)}
        </div>
      </div>
      <footer>
        <button 
          className={styles.button}
          onClick={onResetClick}>リセット</button>
      </footer>
    </>
  )
}

export default App
