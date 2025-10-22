package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.User;

public interface UserService {
    String createUser(User user);

    User loginUser(User user);

    Object getUserRole(String email);

    boolean sendResetLink(String email);
    boolean resetPassword(String token , String newPassword);
}
