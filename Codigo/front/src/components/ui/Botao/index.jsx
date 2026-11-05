import './Botao.css'

const Botao = ({children, color, aoClicar}) => {
    return(
        <button className={color} onClick={aoClicar}>
            {children}
        </button>
    )
}


export default Botao;