import './Fornecedores.css';
import Botao from '../../components/ui/Botao';
import IconeClicavel from '../../components/ui/IconeClicavel';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { useState } from 'react';
import FornecedorModal from '../../resources/fornecedores/components/FornecedorModal';
import DeleteFornecedorModal from '../../resources/fornecedores/components/DeleteFornecedorModal';
import { FornecedorProvider } from '../../resources/fornecedores/contexts/FornecedorContext';
import { useFornecedorContext } from '../../resources/fornecedores/hooks/useFornecedorContext';
import { useFornecedores } from '../../resources/fornecedores/hooks/useFornecedores';

const FornecedoresContent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { abrirModal, abrirModalDelete } = useFornecedorContext();
    const { data: fornecedores = [], isLoading, isError } = useFornecedores();

    // Filtrar fornecedores baseado na busca - sempre garantir que é um array
    let fornecedoresFiltrados = [];
    if (Array.isArray(fornecedores) && fornecedores.length > 0) {
        try {
            fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
                if (!fornecedor) return false;
                const nome = (fornecedor.nomeFantasia || '').toLowerCase();
                const doc = (fornecedor.documento || '');
                return nome.includes(searchTerm.toLowerCase()) || doc.includes(searchTerm);
            });
        } catch (error) {
            console.error('Erro ao filtrar fornecedores:', error);
            fornecedoresFiltrados = fornecedores;
        }
    }

    const handleNovoFornecedor = () => {
        abrirModal('criar', null);
    };

    const handleEditarFornecedor = (fornecedor) => {
        abrirModal('editar', fornecedor);
    };

    const handleDeletarFornecedor = (fornecedor) => {
        abrirModalDelete(fornecedor);
    };

    return (
        <>
            <section className='fornecedores-section'>
                <div className='fornecedores-header'>
                    <div className='fornecedores-header-texto'>
                        <h1>Fornecedores</h1>
                        <p>Cadastro de Fornecedores</p>
                    </div>
                    <Botao
                        color="primary-button"
                        aoClicar={handleNovoFornecedor}
                    >
                        <Plus size={20} /> Novo Fornecedor
                    </Botao>
                </div>

                <div className='fornecedores-table-container'>
                    <div className='fornecedores-search-container'>
                        <div className='search-input-wrapper'>
                            <Search size={20} className='search-icon' />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou CNPJ"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='search-input'
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className='no-results'>
                            <p>Carregando fornecedores...</p>
                        </div>
                    ) : isError ? (
                        <div className='no-results'>
                            <p>Erro ao carregar fornecedores. Tente novamente.</p>
                        </div>
                    ) : (
                    <table className='fornecedores-table'>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Empresa</th>
                                <th>CNPJ</th>
                                <th>Endereço</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fornecedoresFiltrados && fornecedoresFiltrados.length > 0 ? (
                                fornecedoresFiltrados.map((fornecedor, index) => {
                                    try {
                                        return (
                                            <tr key={fornecedor.id}>
                                                <td>{fornecedor.codigoFornecedor || 'N/A'}</td>
                                                <td>
                                                    <div className='empresa-info'>
                                                        <span className='empresa-nome'>{fornecedor.nomeFantasia}</span>
                                                        <span className='empresa-razao'>{fornecedor.razaoSocial}</span>
                                                    </div>
                                                </td>
                                                <td>{fornecedor.documento}</td>
                                                <td>
                                                    {fornecedor.endereco ? 
                                                        `${fornecedor.endereco.logradouro || ''}, ${fornecedor.endereco.numeroEndereco || ''} - ${fornecedor.endereco.cidade || ''}/${fornecedor.endereco.estado || ''}`
                                                        : 'Sem endereço'
                                                    }
                                                </td>
                                                <td className='acoes-container'>
                                                    <IconeClicavel
                                                        Icon={Edit}
                                                        color="grey"
                                                        onClick={() => handleEditarFornecedor(fornecedor)}
                                                    />
                                                    <IconeClicavel
                                                        Icon={Trash}
                                                        color="red"
                                                        onClick={() => handleDeletarFornecedor(fornecedor)}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    } catch (error) {
                                        console.error(`Erro ao renderizar fornecedor ${index}:`, error, fornecedor);
                                        return <tr key={fornecedor.id}><td colSpan="5">Erro ao renderizar fornecedor</td></tr>;
                                    }
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center'}}>Nenhum fornecedor encontrado no banco de dados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    )}
                </div>
            </section>

            <FornecedorModal />            <DeleteFornecedorModal />        </>
    );
};

const Fornecedores = () => {
    return (
        <FornecedorProvider>
            <FornecedoresContent />
        </FornecedorProvider>
    );
};

export default Fornecedores;
