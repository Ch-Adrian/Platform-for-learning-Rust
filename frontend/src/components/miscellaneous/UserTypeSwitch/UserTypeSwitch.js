import React, {useState} from 'react'
import Switch from "react-switch";
import './UserTypeSwitch.css'

const UserTypeSwitch = ({handleSwitchUserType}) => {
    const [checked, setChecked] = useState(false);
    const handleChange = nextChecked => {
        setChecked(nextChecked);
        handleSwitchUserType(nextChecked);
    };

    return (
        <div data-cy="mode-switch" className="user-type-switch-container">
            <label className="user-type-switch-label">
                <span className='span-student-mode'>Tryb studenta</span>
                <Switch
                    onChange={handleChange}
                    checked={checked}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0rem .1rem 0.4rem rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0rem 0rem 0.1rem 0.6rem rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="material-switch"
                />
            </label>
        </div>
    );
}

export default UserTypeSwitch