package aviyanadivine.aviyana.Controller;


import aviyanadivine.aviyana.Entity.AdminProfile;
import aviyanadivine.aviyana.Service.AdminProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/admin")
@RestController
public class AdminProfileController {

    @Autowired
    private AdminProfileService adminProfileService;

    @PutMapping("/{id}")
    public AdminProfile updateAdmin(@PathVariable Long id, @RequestBody AdminProfile admin) {
        return adminProfileService.updateAdmin(id, admin);
    }

}
