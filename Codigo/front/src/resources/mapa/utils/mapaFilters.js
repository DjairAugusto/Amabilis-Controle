export const filtrarObrasParaMapa = (obras, searchNome, searchEndereco) => {
    return obras.filter((obra) => {
        const nomeMatch = (obra.nomeObra?.toLowerCase() || '').includes(searchNome.toLowerCase());
        const enderecoMatch = (obra.endereco?.toLowerCase() || '').includes(searchEndereco.toLowerCase());
        return nomeMatch && enderecoMatch;
    });
};