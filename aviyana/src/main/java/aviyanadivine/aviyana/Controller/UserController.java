package aviyanadivine.aviyana.Controller;


import aviyanadivine.aviyana.Entity.User;
import aviyanadivine.aviyana.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/api/auth")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public String create(@RequestBody User user ){
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.loginUser(user);
    }

}
