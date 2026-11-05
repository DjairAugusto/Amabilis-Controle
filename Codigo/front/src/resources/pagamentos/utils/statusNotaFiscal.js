export const STATUS_NF_BACKEND = {
    VENCIDA: "VENCIDA",
    PENDENTE: "PENDENTE",
    PAGA_PARCIALMENTE: "PAGA_PARCIALMENTE",
    QUITADA: "QUITADA"
};

// 2. O que o Front-end mostra (Tradução Back -> Front)
export const MAPA_STATUS_FRONTEND = {
    [STATUS_NF_BACKEND.VENCIDA]: "Vencida",
    [STATUS_NF_BACKEND.PENDENTE]: "Pendente",
    [STATUS_NF_BACKEND.PAGA_PARCIALMENTE]: "Paga Parcialmente",
    [STATUS_NF_BACKEND.QUITADA]: "Quitada"
};

// 3. O que o Dropdown envia (Tradução Front -> Back)
export const MAPA_STATUS_BACKEND = {
    "Vencida": STATUS_NF_BACKEND.VENCIDA,
    "Pendente": STATUS_NF_BACKEND.PENDENTE,
    "Paga Parcialmente": STATUS_NF_BACKEND.PAGA_PARCIALMENTE,
    "Quitada": STATUS_NF_BACKEND.QUITADA
};

// 4. Lista em array para os Dropdowns e Filtros
export const OPCOES_STATUS_DROPDOWN = Object.values(MAPA_STATUS_FRONTEND);