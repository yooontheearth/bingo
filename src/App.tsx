import { useState } from 'react'
import styles from './App.module.css'
import { useImmer } from 'use-immer'

const initialCandidateNumbers = [...Array(75).keys()].map(i => i + 1);

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function App() {
  const [candidateNumbers, updateCandidateNumbers] = useImmer<number[]>(initialCandidateNumbers)
  const [chosenNumbers, updateChosenNumbers] = useImmer<number[]>([])
  const [currentNumber, updateCurrentNumber] = useState<number>(0)

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

  return (
    <>
      <header>
          <button 
            className={styles.button}
            onClick={onNextNumberClick}>次の番号</button>
      </header>
      <div className={styles.numberContainer}>
        <div className={styles.currentNumber}>
            {currentNumber > 0 && currentNumber}
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
