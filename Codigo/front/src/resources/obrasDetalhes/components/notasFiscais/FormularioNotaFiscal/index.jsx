import { Trash2, Upload } from 'lucide-react';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import './FormularioNotaFiscal.css';
import IconeClicavel from '../../../../../components/ui/IconeClicavel';
import Input from '../../../../../components/ui/Input';
import RecursoAutocomplete from '../../../../recursos/components/RecursoAutocomplete';
import FornecedorAutocomplete from '../../../../fornecedores/components/FornecedorAutocomplete';
import UploadArquivo from '../../../../../components/ui/UploadArquivo';

const FormularioNotaFiscal = forwardRef(
  ({ notaFiscal = null, onSave, isModal = false }, ref) => {

    const criarId = () => `${Date.now()}-${Math.random()}`;

    const [formData, setFormData] = useState({
      id: '',
      numeroDocumento: '',
      fornecedor: { id: '', razaoSocial: '', nomeFantasia: '', cnpj: '' },
      dataEmissao: '',
      dataVencimento: '',
      valorTotal: 0,
      status: 'ATIVO',
      recursos: [],
    });

    const [arquivoNota, setArquivoNota] = useState(null);

    const extrairNumeroDaMoeda = (valor) => {
      if (typeof valor === 'number') return valor;
      if (!valor) return 0;
      return parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    };

    const formatarMoeda = (valor) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valor || 0);
    };

    const extrairDataValida = (valor) => {
      if (typeof valor !== 'string') return null;
      const data = valor.split('T')[0];
      return /^\d{4}-\d{2}-\d{2}$/.test(data) ? data : null;
    };

    useEffect(() => {
      if (!notaFiscal) return;

      const nf = notaFiscal.data || notaFiscal;

      const recursosFormatados = (nf.itens || []).map((item, index) => ({
        id: item.id ?? `temp-${index}`, // evita undefined
        recursoId: item.recurso?.id ?? null,
        descricao: item.recurso?.descricao ?? 'Sem descrição',
        tipo: item.recurso?.tipoRecurso ?? '-',
        valor: formatarMoeda(item.valorItem ?? 0),
      }));

      setFormData({
        id: nf.id ?? '',
        numeroDocumento: nf.numeroDocumento ?? '',
        fornecedor: {
          id: nf.fornecedor?.id ?? nf.fornecedorId ?? '',
          razaoSocial: nf.fornecedor?.razaoSocial || '',
          nomeFantasia: nf.fornecedor?.nomeFantasia || '',
          cnpj: nf.fornecedor?.documento || nf.fornecedor?.cnpj || ''
        },
        dataEmissao: nf.dataEmissao ?? '',
        dataVencimento: nf.dataVencimento ?? '',
        valorTotal: nf.valor_total_nota ?? 0,
        status: nf.status ?? 'ATIVO',
        recursos: recursosFormatados
      });

    }, [notaFiscal]);

    const handleDataExtracted = (data) => {
      console.log("Dados extraídos no formulário:", data);
      if (!data) return;
  
      setFormData(prev => {
        // suporta tanto o novo contrato (camelCase) quanto o antigo (snake_case), usando o que estiver preenchido
        const fornecedorObjeto = typeof data.fornecedor === 'object' ? data.fornecedor : data.fornecedor_autocomplete;
        const novoFornecedor = fornecedorObjeto
          ? {
              id: fornecedorObjeto.id,
              razaoSocial: fornecedorObjeto.razaoSocial,
              nomeFantasia: fornecedorObjeto.nomeFantasia,
              cnpj: fornecedorObjeto.documento || data.fornecedor_cnpj,
            }
          : prev.fornecedor;

        const novosRecursos = (data.itens || [])
          .map(item => {
            const recurso = item.recurso || (data.recursos_autocomplete || []).find(r =>
              r.descricao && item.descricao &&
              r.descricao.toLowerCase() === item.descricao.toLowerCase()
            );
            if (!recurso) return null;
            return {
              id: criarId(),
              recursoId: recurso.id,
              descricao: recurso.descricao,
              tipo: recurso.tipoRecurso || recurso.tipo || '-',
              valor: formatarMoeda(item.valorTotal ?? item.valor_total ?? 0)
            };
          })
          .filter(Boolean);

        return {
          ...prev,
          numeroDocumento: data.numeroDocumento || data.numero_documento || prev.numeroDocumento,
          dataEmissao: extrairDataValida(data.dataEmissao || data.data_emissao) || prev.dataEmissao,
          dataVencimento: extrairDataValida(data.dataVencimento || data.data_vencimento) || prev.dataVencimento,
          valorTotal: data.valorTotalNota ?? data.valor_total_nota ?? data.valorTotalProdutos ?? data.valor_total_produtos ?? prev.valorTotal,
          fornecedor: novoFornecedor,
          recursos: novosRecursos.length > 0 ? novosRecursos : prev.recursos
        };
      });
    };

    const handleSelectRecurso = (recurso) => {
      setFormData(prev => ({
        ...prev,
        recursos: [
          ...prev.recursos,
          {
            id: criarId(),
            recursoId: recurso.id,
            descricao: recurso.descricao,
            tipo: recurso.tipoRecurso || '-',
            valor: ''
          },
        ],
      }));
    };

    const handleSelectFornecedor = (fornecedorSelecionado) => {
      setFormData(prev => ({
        ...prev,
        fornecedor: {
          id: fornecedorSelecionado.id,
          razaoSocial: fornecedorSelecionado.razaoSocial,
          nomeFantasia: fornecedorSelecionado.nomeFantasia,
          cnpj: fornecedorSelecionado.documento
        }
      }));
    };

    const handleMudarValorItem = (idDoItem, novoValorString) => {
      setFormData(prev => ({
        ...prev,
        recursos: prev.recursos.map(r =>
          r.id === idDoItem ? { ...r, valor: novoValorString } : r
        )
      }));
    };

    const removerRecurso = (id) => {
      setFormData(prev => ({
        ...prev,
        recursos: prev.recursos.filter((r) => r.id !== id),
      }));
    };

    const calcularTotal = () => {
      const somaRecursos = formData.recursos.reduce(
        (total, recurso) => total + extrairNumeroDaMoeda(recurso.valor),
        0
      );
      return Math.max(formData.valorTotal || 0, somaRecursos);
    };

    const handleSave = () => {
      if (!formData.numeroDocumento) {
        alert('Preencha o número da NF');
        return;
      }

      if (!formData.fornecedor.id) {
        alert('Selecione um fornecedor válido');
        return;
      }

      const notaComTotal = {
        id: formData.id,
        numeroDocumento: formData.numeroDocumento,
        dataEmissao: formData.dataEmissao,
        dataVencimento: formData.dataVencimento,
        fornecedorId: formData.fornecedor.id,
        valorTotal: calcularTotal(),
        itens: formData.recursos.map(r => ({
          id: typeof r.id === 'string' ? null : r.id,
          recursoId: r.recursoId,
          valorItem: extrairNumeroDaMoeda(r.valor),
          valor: extrairNumeroDaMoeda(r.valor)
        }))
      };

      onSave(notaComTotal);

      console.log("Arquivo a ser enviado:", arquivoNota);
    };

    useImperativeHandle(ref, () => ({
      salvarFormulario: handleSave,
    }));

    return (
      <div className="formulario-nota-fiscal">
        <UploadArquivo
          onFileSelect={(file) => setArquivoNota(file)}
          onDataExtracted={handleDataExtracted}
        />

        <div className="form-row-full">
          <div className="input-group-formulario-nf">
            <label>Fornecedor</label>
            <FornecedorAutocomplete
              valorInicial={formData.fornecedor.nomeFantasia || formData.fornecedor.razaoSocial}
              onSelectFornecedor={handleSelectFornecedor}
            />
          </div>
        </div>

        <div className="form-row-2">
          <Input
            label="Emissão"
            typeInput="date"
            value={formData.dataEmissao}
            onChange={(e) =>
              setFormData({ ...formData, dataEmissao: e.target.value })
            }
          />
          <Input
            label="Vencimento"
            typeInput="date"
            value={formData.dataVencimento}
            onChange={(e) =>
              setFormData({ ...formData, dataVencimento: e.target.value })
            }
          />
        </div>

        <div className="form-row-2">
          <Input
            label="Número da NF"
            value={formData.numeroDocumento}
            placeholder="Ex: xxxxxxx"
            onChange={(e) =>
              setFormData({ ...formData, numeroDocumento: e.target.value })
            }
          />
          <Input
            label="Valor Total"
            value={formatarMoeda(calcularTotal())}
            disabled
          />
        </div>

        <div className="recurso-section">
          <h4>Recurso da Nota</h4>
          <p className="recurso-desc">
            Pesquise e clique no recurso para adicioná-lo
          </p>

          <div className="recurso-select-container">
            <RecursoAutocomplete onSelectRecurso={handleSelectRecurso} />
          </div>

          {formData.recursos.length > 0 && (
            <div className="recursos-list">
              {formData.recursos.map((recurso) => (
                <div key={recurso.id} className="recurso-item">
                  <span className="recurso-desc-text">{recurso.descricao}</span>
                  <span className="recurso-tipo-nf">{recurso.tipo}</span>

                  <Input
                    typeInput="text"
                    value={recurso.valor}
                    onChange={(e) =>
                      handleMudarValorItem(recurso.id, e.target.value)
                    }
                    mask="currency"
                    placeholder="R$00,00"
                  />

                  <IconeClicavel
                    Icon={Trash2}
                    color="#CB5544"
                    size={16}
                    onClick={() => removerRecurso(recurso.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FormularioNotaFiscal.displayName = 'FormularioNotaFiscal';

export default FormularioNotaFiscal;