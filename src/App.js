import React, { useState, useEffect } from 'react';
import * as classFormatter from 'classnames';

import { FACTORIALS } from './consts'
import './app.scss';

const Die = ({ position, hand, setHand}) => {
  return (
    <li className="c_die">
      <p> Die value </p>
      <input
        type="number"
        onChange={ (event) => setHand( hand.map( (item,index) => {
          if (index === position) {
            return parseInt(event.target.value)
          }
          return item
        }))}
      />
    </li>
  )
}

const App = () => {
  const [ diceCount, setDiceCount ] = useState(0)
  const [ handCount, setHandCount ] = useState(0)
  const [ hand, setHand ] = useState([])
  
  const [ betCount, setBetCount ] = useState(0)
  const [ betFace, setBetFace ] = useState(0)
  const [ betOdds, setBetOdds ] = useState(0)
  const [ bets, setBets ] = useState([{count: 0, face: 2, odds: 1}])

  useEffect(
    () => {
      try {
        let newHand = Array(parseInt(handCount))
        for (let i=0; i<handCount; i++) {
          newHand[i] = 0
        }
        setHand(newHand)
      } catch {
        console.log('failed')
      }
    },
    [ handCount ]
  )

  useEffect(
    () => {
      let inHand = hand.filter( item => (item === betFace) ).length
      let toPull = betCount - inHand
      let unknownDice = diceCount - handCount

/*      console.log("----- inHand -------")
      console.log(inHand)
      console.log("----- toPull -------")
      console.log(toPull)
      console.log("----- unknownDice -------")
      console.log(unknownDice)*/

      let pSuccess = Math.pow(1/3,toPull) //1's are wild
      let pFailure = Math.pow(2/3,unknownDice-toPull)

/*      console.log("----- pSuccess -------")
      console.log(pSuccess)
      console.log("----- pFailure -------")
      console.log(pFailure)*/

      let combinations = FACTORIALS[unknownDice] / ( FACTORIALS[unknownDice-toPull] * FACTORIALS[toPull])
      setBetOdds( pSuccess * pFailure * combinations )
    },
    [ hand, betCount, diceCount, handCount, betFace ]
  )

  const checkBet = () => {
    let lastBet = bets[bets.length - 1]
    if (betCount > lastBet.count ) {
      return true
    }
    else if ( betCount < lastBet.count && betFace > lastBet.face) {
      return true
    }
    else {
      return false
    }
  }

  const submitBet = () => {
    if (checkBet()) {
      setBets([...bets, {
        count: betCount,
        face: betFace,
      }])

      setBetCount(0)
      setBetFace(0)
    }
  }

  let curBetValid = checkBet()

  return (
    <div className="c_app">
      <h1 className="c_app__title"> 
        Liar's dice 
      </h1>
      <a
        href="https://en.wikipedia.org/wiki/Liar%27s_dice"
        target="_blank"
        rel="noopener noreferrer">
        Wiki Article
      </a>
      <label
        htmlFor="dice-count-input">
        Total number of dice (including your dice)
      </label>
      <input
        className="c_app__dice-count"
        id="dice-count-input"
        value={diceCount}
        type="number"
        onChange={ (event) => setDiceCount(parseInt(event.target.value))}>
      </input>
      <label
        htmlFor="hand-count-input">
        Number of dice in hand
      </label>
      <input
        className="c_app__hand-count"
        id="hand-count-input"
        value={handCount}
        type="number"
        onChange={ (event) => setHandCount(parseInt(event.target.value))}>
      </input>
      <label
        htmlFor="dice-hand">
        Current Hand
      </label>
      <ol
        className="c_app__dice-hand" 
        id="dice-hand">
        { hand.map( (item,index) => (
          <Die
            key={index}
            position={index}
            hand={hand}
            setHand={setHand}
          />
        ))}
      </ol>
      <label>
        Current Bet
      </label>
      <input
        className={classFormatter(
          "c_app__bet-input",
          {"c_app__bet-input--invalid": !curBetValid},
        )}
        type="number"
        placeholder="# of dice"
        onChange={ (event) => setBetCount(parseInt(event.target.value))}
      />
      <input
        className={classFormatter(
          "c_app__bet-input",
          {"c_app__bet-input--invalid": !curBetValid},
        )}
        type="number"
        placeholder="dice face"
        onChange={ (event) => setBetFace(parseInt(event.target.value))}
      />
      <button
        className="c_app__submit-bet"
        onClick={submitBet}>
        Submit Bet
      </button>
      <label>
        Previous Bets
      </label>
      <ol
        className="c_app__previous-bets"
        id="previous-bets">
        { bets.map( (item,index) => (
          <li key={index}>
            <p> {`${item.count} ${item.face} s`} </p>
          </li>
        ))}
      </ol>
      <label>
        Odds
      </label>
      <p> { betOdds } </p>
    </div>
  );
}

export default App;
