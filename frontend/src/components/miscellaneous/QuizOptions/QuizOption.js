import { Checkbox } from "@mui/material";
import "./QuizOption.css"
import Button from 'react-bootstrap/Button';

const QuizOption = (props) => {

    return (
        <div className='background'>
            <input type="text" className='text-field' name='option'/>
            <div className='management'>
                <div className='checkbox'><Checkbox></Checkbox>poprawna</div>
                <Button onClick={props.deleteOption} className='button-x'>X</Button>
                </div>
        </div>
    );
}

export default QuizOption
