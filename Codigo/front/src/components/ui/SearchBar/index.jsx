import { Search } from "lucide-react"
import "./SearchBar.css"


const SearchBar = ({placeholder, value, onChange}) => {
    return (
        <div className='search-input-wrapper'>
            <Search size={20} className='search-icon' />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="search-input"
            />
        </div>
    )
}

export default SearchBar