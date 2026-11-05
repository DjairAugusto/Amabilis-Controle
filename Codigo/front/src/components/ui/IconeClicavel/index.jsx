import './IconeClicavel.css'

const IconeClicavel = ({Icon, color, onClick, size = 16}) => {
    return(
        <button className='icone-clicavel' onClick={onClick}>
            <Icon color={color} size={size} />
        </button>
    )
}

export default IconeClicavel;