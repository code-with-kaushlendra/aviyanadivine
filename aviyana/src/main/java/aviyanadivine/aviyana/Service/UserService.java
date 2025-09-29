package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.User;

public interface UserService {
    String createUser(User user);

    String loginUser(User user);
}
