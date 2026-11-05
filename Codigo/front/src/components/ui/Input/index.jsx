import { applyMask } from '../../../utils/maskConfig';
import './Input.css'

const Input = ({ label, typeInput = "text", placeholder, value, onChange, mask, disabled=false }) => {

    const handleChange = (e) => {
        let inputValue = e.target.value;

        if (mask) {
            inputValue = applyMask(inputValue, mask);
        }

        onChange({
            ...e,
            target: {
                ...e.target,
                value: inputValue
            }
        });
    };

    return (
        <div className="input">
            {label && <label>{label}</label>}
            <input
                type={typeInput}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
            />
        </div>
    );
};

export default Input;