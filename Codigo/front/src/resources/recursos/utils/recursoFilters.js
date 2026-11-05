export const filtrarArvoreRecursos = (estruturaPorTipo, termo) => {
    if (!termo || !termo.trim()) return estruturaPorTipo;

    const termoMin = termo.toLowerCase();
    const estruturaFiltrada = {};

    const filtrarRecursos = (recursos) => {
        if (!recursos) return [];
        
        return recursos.reduce((acc, rec) => {
            const isMatch = (rec.descricao?.toLowerCase() || '').includes(termoMin) ||
                            (rec.codigoHierarquico?.toLowerCase() || '').includes(termoMin);

            let filhosFiltrados = [];
            if (rec.children && rec.children.length > 0) {
                filhosFiltrados = filtrarRecursos(rec.children);
            }

            if (isMatch || filhosFiltrados.length > 0) {
                acc.push({ ...rec, children: filhosFiltrados });
            }
            return acc;
        }, []);
    };

    Object.keys(estruturaPorTipo).forEach(tipo => {
        const grupos = estruturaPorTipo[tipo] || [];
        
        const gruposFiltrados = grupos.reduce((acc, grupo) => {
            const isGrupoMatch = (grupo.nome?.toLowerCase() || '').includes(termoMin);
            const recursosFiltrados = filtrarRecursos(grupo.recursos);

            if (isGrupoMatch || recursosFiltrados.length > 0) {
                acc.push({ 
                    ...grupo, 
                    recursos: isGrupoMatch && recursosFiltrados.length === 0 ? grupo.recursos : recursosFiltrados 
                });
            }
            return acc;
        }, []);

        if (gruposFiltrados.length > 0) {
            estruturaFiltrada[tipo] = gruposFiltrados;
        }
    });

    return estruturaFiltrada;
};