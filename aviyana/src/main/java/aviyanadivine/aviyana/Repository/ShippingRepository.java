package aviyanadivine.aviyana.Repository;

import aviyanadivine.aviyana.Entity.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingRepository extends JpaRepository<ShippingAddress , Long> {
}
