package amabilis.controle.domain.enums;

public enum StatusObra {
    EM_ANDAMENTO("Em andamento"),
    FINALIZADA("Finalizada");

    private final String descricao;

    StatusObra(String descricao) {
        this.descricao = descricao;
    }

    // Método para resgatar a string formatada
    public String getDescricao() {
        return descricao;
    }
}