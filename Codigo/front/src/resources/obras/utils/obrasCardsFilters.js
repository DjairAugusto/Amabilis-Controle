export const filtrarCardsObras = (obras, termo) => {
    if(!termo) return obras;

    const termoMin = termo.toLowerCase();

    return obras.reduce((acc, obra) => {
        const isMatch = (obra.nome?.toLowerCase() || '').includes(termoMin) 
        if (isMatch) {
            acc.push({ ...obra });
        }
        return acc;
    }, []);
}