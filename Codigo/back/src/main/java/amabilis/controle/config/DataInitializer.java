package amabilis.controle.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import amabilis.controle.repository.FornecedorRepository;
import amabilis.controle.repository.GrupoRecursoRepository;
import amabilis.controle.repository.ObraRepository;
import amabilis.controle.repository.RecursoRepository;
import amabilis.controle.repository.notaFiscal.NotaFiscalRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(DataInitializer.class);

    private final GrupoRecursoRepository grupoRecursoRepository;
    private final RecursoRepository recursoRepository;
    private final FornecedorRepository fornecedorRepository;
    private final ObraRepository obraRepository;
    private final NotaFiscalRepository notaFiscalRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public DataInitializer(GrupoRecursoRepository grupoRecursoRepository,
                           RecursoRepository recursoRepository,
                           FornecedorRepository fornecedorRepository,
                           ObraRepository obraRepository,
                           NotaFiscalRepository notaFiscalRepository) {
        this.grupoRecursoRepository = grupoRecursoRepository;
        this.recursoRepository = recursoRepository;
        this.fornecedorRepository = fornecedorRepository;
        this.obraRepository = obraRepository;
        this.notaFiscalRepository = notaFiscalRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        LOGGER.info("DataInitializer ignorado.");
    }
}
