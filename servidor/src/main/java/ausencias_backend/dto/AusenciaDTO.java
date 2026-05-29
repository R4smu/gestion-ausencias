package ausencias_backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AusenciaDTO {
    private String docente;
    private LocalDate fecha;
    private String motivo;
}