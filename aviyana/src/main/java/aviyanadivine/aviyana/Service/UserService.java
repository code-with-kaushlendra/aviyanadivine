package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.User;

public interface UserService {
    String createUser(User user);

    boolean loginUser(User user);
}
