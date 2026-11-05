package amabilis.controle.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import amabilis.controle.domain.Fornecedor;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    Optional<Fornecedor> findTopByOrderByIdDesc();

    Optional<Fornecedor> findByDocumento(String documento);

}
