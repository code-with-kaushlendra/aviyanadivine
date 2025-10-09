package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.Payment;
import org.json.JSONObject;

import java.util.Map;

public interface PaymentService {
    JSONObject createOrder(Map<String, Object> data);

    Payment savePayment(Payment payment);
}
