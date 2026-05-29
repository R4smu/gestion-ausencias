package ausencias_backend.controller;

import ausencias_backend.dto.ResolucionDTO;
import ausencias_backend.model.Ausencia;
import ausencias_backend.repository.AusenciaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ausencias")
@CrossOrigin(origins = "http://localhost:5173")
public class AusenciaController {

    private static final Logger logger = LoggerFactory.getLogger(AusenciaController.class);
    
    private final AusenciaRepository repository;
    
    private static final String UPLOAD_DIR = "uploads/";

    public AusenciaController(AusenciaRepository repository) {
        this.repository = repository;
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (Exception _) {
            logger.error("No se pudo crear el directorio de subidas");
        }
    }

    @GetMapping
    public List<Ausencia> obtenerTodas() {
        return repository.findAll();
    }

    @GetMapping("/dias/{docente}")
    public int obtenerDiasDisponibles(@PathVariable String docente) {
        long diasUsados = repository.findAll().stream()
                .filter(a -> a.getDocente().equals(docente))
                .filter(a -> "Asuntos Personales".equals(a.getMotivo()))
                .filter(a -> "Aprobada".equals(a.getEstado()) || "Pendiente".equals(a.getEstado()))
                .count();
        return Math.max(0, 4 - (int) diasUsados);
    }

    @PostMapping
    public ResponseEntity<Object> crearAusencia(
            @RequestParam("docente") String docente,
            @RequestParam("fecha") LocalDate fecha,
            @RequestParam("motivo") String motivo,
            @RequestParam(value = "archivo", required = false) MultipartFile archivo) { 

        if ("Asuntos Personales".equals(motivo)) {
            int diasRestantes = obtenerDiasDisponibles(docente);
            if (diasRestantes <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("No te quedan días de Asuntos Personales disponibles.");
            }
        }

        Ausencia nuevaAusencia = new Ausencia();
        nuevaAusencia.setDocente(docente);
        nuevaAusencia.setFecha(fecha);
        nuevaAusencia.setMotivo(motivo);
        nuevaAusencia.setEstado("Pendiente");

        if (archivo != null && !archivo.isEmpty()) {
            try {
                String nombreArchivo = UUID.randomUUID().toString() + "_" + archivo.getOriginalFilename();
                Path rutaDestino = Paths.get(UPLOAD_DIR + nombreArchivo);
                Files.copy(archivo.getInputStream(), rutaDestino, StandardCopyOption.REPLACE_EXISTING);
                nuevaAusencia.setArchivoAdjunto(nombreArchivo);
            } catch (Exception _) {
                logger.error("Error al guardar el archivo adjunto.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al guardar el archivo adjunto.");
            }
        }

        Ausencia guardada = repository.save(nuevaAusencia);
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/{id}")
    public Ausencia resolverAusencia(@PathVariable Long id, @RequestBody ResolucionDTO resolucion) {
        Ausencia ausenciaExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada con ID: " + id));
        
        ausenciaExistente.setEstado(resolucion.getEstado());
        ausenciaExistente.setFeedback(resolucion.getFeedback());
        
        return repository.save(ausenciaExistente);
    }

    @GetMapping("/archivos/{nombreArchivo}")
    public ResponseEntity<Resource> obtenerArchivo(@PathVariable String nombreArchivo) {
        try {
            Path rutaArchivo = Paths.get(UPLOAD_DIR).resolve(nombreArchivo).normalize();
            Resource recurso = new UrlResource(rutaArchivo.toUri());

            if (recurso.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + recurso.getFilename() + "\"")
                        .body(recurso);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception _) {
            logger.error("Error al obtener el archivo del sistema.");
            return ResponseEntity.internalServerError().build();
        }
    }
}