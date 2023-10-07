import React, { useEffect, useState, memo } from 'react'
import './MutableStringPicker.css'

const MutableStringPicker = memo((props) => {
    const {initialMutableString, updateMutableStringHandler} = props;
    const [mutableString, setMutableString] = useState(initialMutableString);

    const changeMutableStringHandler = (event) => {
        setMutableString(event.target.value);
    }

    useEffect(() => {
        setMutableString(initialMutableString);
    }, [initialMutableString])

    useEffect(() => {
        const timeOutId = setTimeout(() => {updateMutableStringHandler(mutableString)}, 650);
        return () => clearTimeout(timeOutId);
    }, [mutableString, updateMutableStringHandler])


  return (
     <div className='mutable-string-container'>
        <p>Skopiuj napis po prawej i wklej tam, gdzie chcesz, aby student miał możliwość modyfikacji kodu</p>
        <input type='text' onChange={changeMutableStringHandler} value={mutableString}/>
    </div>
  )
})

export default MutableStringPicker