package amabilis.controle.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import amabilis.controle.dto.dashboard.GraficoDTO;
import amabilis.controle.service.DashboardService;

@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard/resumo")
    public ResponseEntity<Map<String, Object>> resumo() {
        return ResponseEntity.ok(dashboardService.getResumo());
    }

    @GetMapping("/dashboard/pagamentos")
    public ResponseEntity<GraficoDTO> pagamentos() {
        return ResponseEntity.ok(dashboardService.getPagamentosGrafico());
    }

    @GetMapping("/dashboard/fornecedores")
    public ResponseEntity<GraficoDTO> fornecedores() {
        return ResponseEntity.ok(dashboardService.getFornecedoresGrafico());
    }

    @GetMapping("/dashboard/recursos")
    public ResponseEntity<GraficoDTO> recursos() {
        return ResponseEntity.ok(dashboardService.getRecursosGrafico());
    }

    @GetMapping("/dashboard/evolucao-mensal")
    public ResponseEntity<List<Map<String, Object>>> evolucaoMensal(
            @RequestParam(required = false) LocalDate dataInicio,
            @RequestParam(required = false) LocalDate dataFim) {
        return ResponseEntity.ok(dashboardService.getEvolucaoMensal(dataInicio, dataFim));
    }

    @GetMapping("/dashboard/obra/{id}")
    public ResponseEntity<Map<String, Object>> estatisticasObra(@PathVariable Long id) {
        return ResponseEntity.ok(dashboardService.getEstatisticasObra(id));
    }
}
