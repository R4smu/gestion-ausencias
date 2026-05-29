package ausencias_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "ausencias")
@Data
public class Ausencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String docente;
    private LocalDate fecha;
    private String motivo;
    private String estado;
    private String feedback;
    private String archivoAdjunto; 
}