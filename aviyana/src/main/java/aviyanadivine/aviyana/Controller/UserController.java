package aviyanadivine.aviyana.Controller;


import aviyanadivine.aviyana.Entity.User;
import aviyanadivine.aviyana.Repository.UserInfoRepository;
import aviyanadivine.aviyana.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequestMapping("/api/auth")
@RestController
public class UserController {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> create(@RequestBody User user) {
        userService.createUser(user);
        return ResponseEntity.ok(Map.of("message", "User Added Successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        Optional<User> found = userInfoRepository.findByEmail(user.getEmail());

        if (found.isPresent()) {
            User dbUser = found.get();
            boolean passwordMatch = passwordEncoder.matches(user.getPassword(), dbUser.getPassword());

            if (passwordMatch) {
                int isAdmin = dbUser.isAdmin() ? 1 : 0;

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login successful");
                System.out.println(isAdmin);
                response.put("is_admin", isAdmin);
                response.put("id", dbUser.getId());

                return ResponseEntity.ok(response);
            }
        }

        // Login failed
        Map<String, Object> error = new HashMap<>();
        error.put("message", "Invalid email or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

}
