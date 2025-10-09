package aviyanadivine.aviyana.Controller;

import aviyanadivine.aviyana.Entity.Payment;
import aviyanadivine.aviyana.Service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;



    @PostMapping("/create-order")
    public String createOrder(@RequestBody Map<String, Object> data) {
        JSONObject order = paymentService.createOrder(data);
        return order.toString();
    }

    @PostMapping("/save")
    public Payment savePayment(@RequestBody Payment payment) {
        return paymentService.savePayment(payment);
    }
}