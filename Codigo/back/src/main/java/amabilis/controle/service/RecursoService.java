package amabilis.controle.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import amabilis.controle.dto.DescricaoRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import amabilis.controle.domain.GrupoRecurso;
import amabilis.controle.domain.Recurso;
import amabilis.controle.domain.enums.TipoRecurso;
import amabilis.controle.dto.RecursoDTO;
import amabilis.controle.dto.RecursoHierarquiaDTO;
import amabilis.controle.repository.GrupoRecursoRepository;
import amabilis.controle.repository.RecursoRepository;

@Service
public class RecursoService {

    @Autowired
    private RecursoRepository recursoRepository;

    @Autowired
    private GrupoRecursoRepository grupoRecursoRepository;

    public List<RecursoDTO> listar() {
        garantirCodigosHierarquicos();

        return recursoRepository.findAll().stream()
            .map(recurso -> new RecursoDTO(
                recurso.getId(),
                recurso.getCodigoHierarquico(),
                recurso.getTipoRecurso(),
                recurso.getRecursoSuperior() != null ? recurso.getRecursoSuperior().getId() : null,
                recurso.getDescricao(),
                recurso.getGrupoRecurso() != null ? recurso.getGrupoRecurso().getId() : null,
                recurso.getGrupoRecurso() != null ? recurso.getGrupoRecurso().getNomeGrupo() : null,
                recurso.getUnidadeMedida()
            ))
            .toList();
    }

    public List<RecursoHierarquiaDTO> listarComHierarquia() {
        garantirCodigosHierarquicos();

        List<Recurso> recursos = recursoRepository.findAll();

        Map<Long, List<Recurso>> filhosPorPaiId = recursos.stream()
            .filter(recurso -> recurso.getRecursoSuperior() != null)
            .collect(Collectors.groupingBy(recurso -> recurso.getRecursoSuperior().getId()));

        return recursos.stream()
            .filter(recurso -> recurso.getRecursoSuperior() == null)
            .map(recurso -> mapperParaHierarquia(recurso, filhosPorPaiId))
            .toList();
    }

    public RecursoDTO buscarPorId(Long id) {
        Recurso recurso = buscarRecursoPorId(id);
        return new RecursoDTO(
            recurso.getId(),
            recurso.getCodigoHierarquico(),
            recurso.getTipoRecurso(),
            recurso.getRecursoSuperior() != null ? recurso.getRecursoSuperior().getId() : null,
            recurso.getDescricao(),
            recurso.getGrupoRecurso() != null ? recurso.getGrupoRecurso().getId() : null,
            recurso.getGrupoRecurso() != null ? recurso.getGrupoRecurso().getNomeGrupo() : null,
            recurso.getUnidadeMedida()
        );
    }

    public List<RecursoDTO> buscarPorDescricao(DescricaoRequestDTO dto) {
        List<RecursoDTO> recursos = new ArrayList<>();

        for(String descricao: dto.descricoes()) {
            Recurso recurso = recursoRepository.findByDescricaoContainingIgnoreCase(descricao);

            if(recurso == null){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recurso não encontrado");
            }

            recursos.add(new RecursoDTO(
                    recurso.getId(),
                    recurso.getCodigoHierarquico(),
                    recurso.getTipoRecurso(),
                    recurso.getRecursoSuperior() != null ? recurso.getRecursoSuperior().getId() : null,
                    recurso.getDescricao(),
                    recurso.getGrupoRecurso() != null ? recurso.getGrupoRecurso().getId() : null,
                    recurso.getGrupoRecurso() != null ? recurso.getGrupoRecurso().getNomeGrupo() : null,
                    recurso.getUnidadeMedida()
            ));
        }

        return recursos;
    }

    @Transactional
    public RecursoDTO criar(RecursoDTO dto) {
        if (dto.descricao() == null || dto.grupoRecursoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados obrigatórios não informados");
        }

        Recurso recurso = new Recurso();
        String descricaoNormalizada = dto.descricao().trim();

        GrupoRecurso grupoRecurso = grupoRecursoRepository.findById(dto.grupoRecursoId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de Recurso não encontrado (ID: " + dto.grupoRecursoId() + ")"));

        recurso.setDescricao(descricaoNormalizada);
        recurso.setUnidadeMedida(dto.unidadeMedida());

        Recurso recursoPai = obterRecursoPai(dto.recursoPaiId(), null);
        recurso.setRecursoSuperior(recursoPai);

        validarDuplicidadeRecurso(descricaoNormalizada, dto.grupoRecursoId(), dto.recursoPaiId(), null);

        recurso.setGrupoRecurso(grupoRecurso);
        recurso.setTipoRecurso(grupoRecurso.getTipoRecurso());

        validarTipoComRecursoPai(recursoPai, grupoRecurso.getTipoRecurso());
        recurso.setCodigoHierarquico(gerarProximoCodigoHierarquico(recursoPai, grupoRecurso.getTipoRecurso()));

        recursoRepository.save(recurso);

        return new RecursoDTO(
            recurso.getId(),
            recurso.getCodigoHierarquico(),
            recurso.getTipoRecurso(),
            recurso.getRecursoSuperior() != null ? recurso.getRecursoSuperior().getId() : null,
            recurso.getDescricao(),
            dto.grupoRecursoId(),
            grupoRecurso.getNomeGrupo(),
            recurso.getUnidadeMedida()
        );
    }

    @Transactional
    public RecursoDTO atualizar(Long id, RecursoDTO dto) {
        if (dto.descricao() == null || dto.grupoRecursoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados obrigatórios não informados");
        }

        Recurso recurso = buscarRecursoPorId(id);
        TipoRecurso tipoAnterior = recurso.getTipoRecurso();
        Long recursoPaiIdAnterior = recurso.getRecursoSuperior() != null ? recurso.getRecursoSuperior().getId() : null;

        String descricaoNormalizada = dto.descricao().trim();
        recurso.setDescricao(descricaoNormalizada);
        recurso.setUnidadeMedida(dto.unidadeMedida());

        Recurso novoPai = obterRecursoPai(dto.recursoPaiId(), id);
        recurso.setRecursoSuperior(novoPai);

        GrupoRecurso grupoRecurso = grupoRecursoRepository.findById(dto.grupoRecursoId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo de Recurso não encontrado"));

        validarDuplicidadeRecurso(descricaoNormalizada, dto.grupoRecursoId(), dto.recursoPaiId(), id);

        recurso.setGrupoRecurso(grupoRecurso);
        recurso.setTipoRecurso(grupoRecurso.getTipoRecurso());

        validarTipoComRecursoPai(novoPai, grupoRecurso.getTipoRecurso());

        Long novoRecursoPaiId = novoPai != null ? novoPai.getId() : null;
        TipoRecurso novoTipo = grupoRecurso.getTipoRecurso();

        if (!Objects.equals(recursoPaiIdAnterior, novoRecursoPaiId) || !Objects.equals(tipoAnterior, novoTipo)) {
            String novoCodigo = gerarProximoCodigoHierarquico(novoPai, novoTipo);
            atualizarCodigoDaSubarvore(recurso, novoCodigo);
        }

        Recurso atualizado = recursoRepository.save(recurso);

        return new RecursoDTO(
            atualizado.getId(),
            atualizado.getCodigoHierarquico(),
            atualizado.getTipoRecurso(),
            atualizado.getRecursoSuperior() != null ? atualizado.getRecursoSuperior().getId() : null,
            atualizado.getDescricao(),
            atualizado.getGrupoRecurso().getId(),
            atualizado.getGrupoRecurso().getNomeGrupo(),
            atualizado.getUnidadeMedida()
        );
    }

    public void deletar(Long id) {
        Recurso recurso = buscarRecursoPorId(id);
        recursoRepository.delete(recurso);
    }

    private Recurso buscarRecursoPorId(Long id) {
        return recursoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recurso não encontrado"));
    }

    private Recurso obterRecursoPai(Long recursoPaiId, Long recursoAtualId) {
        if (recursoPaiId == null) return null;
        if (recursoAtualId != null && recursoAtualId.equals(recursoPaiId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recurso não pode ser pai de si mesmo");
        }
        return buscarRecursoPorId(recursoPaiId);
    }

    private RecursoHierarquiaDTO mapperParaHierarquia(Recurso recurso, Map<Long, List<Recurso>> filhosPorPaiId) {
        List<RecursoHierarquiaDTO> children = filhosPorPaiId.getOrDefault(recurso.getId(), new ArrayList<>()).stream()
            .map(filho -> mapperParaHierarquia(filho, filhosPorPaiId))
            .toList();

        return new RecursoHierarquiaDTO(
            recurso.getId(),
            recurso.getCodigoHierarquico(),
            recurso.getTipoRecurso(),
            recurso.getDescricao(),
            recurso.getGrupoRecurso() != null ? recurso.getGrupoRecurso().getId() : null,
            recurso.getGrupoRecurso() != null ? recurso.getGrupoRecurso().getNomeGrupo() : null,
            recurso.getUnidadeMedida(),
            children
        );
    }

    private void validarTipoComRecursoPai(Recurso recursoPai, TipoRecurso tipoRecurso) {
        if (recursoPai == null || recursoPai.getTipoRecurso() == null || tipoRecurso == null) return;
        if (!recursoPai.getTipoRecurso().equals(tipoRecurso)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O recurso filho deve ter o mesmo tipo do pai");
        }
    }

    private void validarDuplicidadeRecurso(String descricao, Long grupoRecursoId, Long recursoPaiId, Long ignorarId) {
        boolean duplicado = recursoRepository.existsDuplicado(descricao, grupoRecursoId, recursoPaiId, ignorarId);
        if (duplicado) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Já existe um recurso com esta descrição neste grupo");
        }
    }

    private String gerarProximoCodigoHierarquico(Recurso recursoPai, TipoRecurso tipoRecurso) {
        if (tipoRecurso == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de recurso não informado");
        }

        List<Recurso> irmaos = recursoPai == null
            ? recursoRepository.findByRecursoSuperiorIsNullOrderByCodigoHierarquicoAsc().stream()
                .filter(recurso -> tipoRecurso.equals(recurso.getTipoRecurso()))
                .toList()
            : recursoRepository.findByRecursoSuperiorIdOrderByCodigoHierarquicoAsc(recursoPai.getId());

        long proximaSequencia = irmaos.stream()
            .map(Recurso::getCodigoHierarquico)
            .filter(Objects::nonNull)
            .map(this::extrairUltimoNivel)
            .max(Long::compareTo)
            .orElse(0L) + 1;

        String sufixo = String.format("%02d", proximaSequencia);
        if (recursoPai == null) {
            return obterPrefixoTipoRecurso(tipoRecurso) + "." + sufixo;
        }

        return recursoPai.getCodigoHierarquico() + "." + sufixo;
    }

    private long extrairUltimoNivel(String codigoHierarquico) {
        try {
            String[] partes = codigoHierarquico.split("\\.");
            return Long.parseLong(partes[partes.length - 1]);
        } catch (Exception e) {
            return 0L;
        }
    }

    private void atualizarCodigoDaSubarvore(Recurso raiz, String codigoRaiz) {
        raiz.setCodigoHierarquico(codigoRaiz);
        recursoRepository.save(raiz);

        List<Recurso> filhos = recursoRepository.findByRecursoSuperiorIdOrderByIdAsc(raiz.getId());
        for (int i = 0; i < filhos.size(); i++) {
            String codigoFilho = codigoRaiz + "." + String.format("%02d", i + 1);
            atualizarCodigoDaSubarvore(filhos.get(i), codigoFilho);
        }
    }

    private void garantirCodigosHierarquicos() {
        if (!recursoRepository.existsByCodigoHierarquicoIsNull()) {
            return;
        }

        Map<TipoRecurso, Integer> sequenciaPorTipo = new java.util.EnumMap<>(TipoRecurso.class);
        List<Recurso> raizes = recursoRepository.findByRecursoSuperiorIsNullOrderByIdAsc();
        for (Recurso raiz : raizes) {
            TipoRecurso tipo = raiz.getTipoRecurso();
            if (tipo == null) continue;

            int proximaSequencia = sequenciaPorTipo.merge(tipo, 1, Integer::sum);
            String codigoRaiz = obterPrefixoTipoRecurso(tipo) + "." + String.format("%02d", proximaSequencia);
            atualizarCodigoDaSubarvore(raiz, codigoRaiz);
        }
    }

    private String obterPrefixoTipoRecurso(TipoRecurso tipoRecurso) {
        if (tipoRecurso == null) return "00";
        return switch (tipoRecurso) {
            case MATERIAL -> "01";
            case EQUIPAMENTO -> "02";
            case SERVICO_DE_TERCEIRO -> "03";
            case MAO_DE_OBRA_DIRETO -> "04";
            case INDIRETO -> "05";
        };
    }
}