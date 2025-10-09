package aviyanadivine.aviyana.Repository;

import aviyanadivine.aviyana.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<User,Long> {


    Optional<User> findByEmailAndPassword(String email, String password);
    Optional<User> findByEmail(String email);
}
