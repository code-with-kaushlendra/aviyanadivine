package aviyanadivine.aviyana.Controller;


import aviyanadivine.aviyana.Entity.PasswordResetRequest;
import aviyanadivine.aviyana.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins= "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/forgotpassword")
    public ResponseEntity<?> fortgotPassword(@RequestBody Map<String,String> payload){
        String email=payload.get("email");

        boolean result=userService.sendResetLink(email);
        if (result) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email not found"));
        }
    }

    @PostMapping("/resetpassword")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest resetRequest){
        boolean result=userService.resetPassword(resetRequest.getToken(),resetRequest.getNewPassword());

        if(result){
            return ResponseEntity.ok(Map.of("success",true));

        }
        else{
            return ResponseEntity.badRequest().body(Map.of("success",false,"message","Invalid or expired token"));
        }
    }

}
