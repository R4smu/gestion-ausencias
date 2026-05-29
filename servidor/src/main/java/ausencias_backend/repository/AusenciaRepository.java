package ausencias_backend.repository;

import ausencias_backend.model.Ausencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AusenciaRepository extends JpaRepository<Ausencia, Long> {

}