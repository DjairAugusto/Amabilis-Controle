export const filtrarArvoreTarefas = (nodes, termo) => {
    if (!termo) return nodes; 
    
    const termoMin = termo.toLowerCase();

    return nodes.reduce((acc, node) => {
        const isMatch = (node.descricao?.toLowerCase() || '').includes(termoMin) || 
                        (node.codigoTarefa?.toLowerCase() || node.codigo_tarefa?.toLowerCase() || '').includes(termoMin);

        let filhosFiltrados = [];
        if (node.children && node.children.length > 0) {
            filhosFiltrados = filtrarArvoreTarefas(node.children, termo);
        }

        if (isMatch || filhosFiltrados.length > 0) {
            acc.push({ ...node, children: filhosFiltrados });
        }
        
        return acc;
    }, []);
};