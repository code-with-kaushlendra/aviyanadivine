package aviyanadivine.aviyana.Controller;

import aviyanadivine.aviyana.Entity.ShippingAddress;
import aviyanadivine.aviyana.Repository.ShippingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "http://localhost:5500") // your frontend port
public class ShippingController {

    @Autowired
    private ShippingRepository repo;

    @PostMapping("/save")
    public ResponseEntity<String> saveAddress(@RequestBody ShippingAddress address) {
        repo.save(address);
        return ResponseEntity.ok("Address saved successfully");
    }
}

