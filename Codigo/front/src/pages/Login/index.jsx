import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; 
import './Login.css';

import logoImg from '../../assets/images/logoAmabilis.png';
import tituloImg from '../../assets/images/tituloAmabilis.png';
import predioImg from '../../assets/images/predioImg.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const { login } = useAuth(); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const sucesso = await login(email, senha);
        
        if (sucesso) {
            navigate('/');
        } else {
            alert('Falha no login. Verifique seu email e senha.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                
                <div className="login-brand">
                    <img src={logoImg} alt="Logo Amabilis" className="logo-img" />
                    <img src={tituloImg} alt="Amabilis Controle" className="title-img" />
                </div>

                <div className="login-card">
                    <h2>Log In</h2>
                    <p>Bem vindo de volta, por favor insira suas informações</p>
                    
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email</label>
                            <input 
                                type="email" 
                                placeholder="Entre com seu Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <label>Senha</label>
                            <div className="password-wrapper">
                                <input 
                                    type={mostrarSenha ? "text" : "password"} 
                                    placeholder="*****************" 
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                >
                                    {mostrarSenha ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn-login">ENTRAR</button>
                    </form>
                </div>
            </div>

            <div className="login-right">
                <img src={predioImg} alt="Prédio Amabilis" className="predio-img" />
            </div>
        </div>
    );
}

export default Login;