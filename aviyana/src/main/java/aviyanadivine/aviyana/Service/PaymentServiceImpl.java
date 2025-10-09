package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.Payment;
import aviyanadivine.aviyana.Repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;


import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    private final PaymentRepository paymentRepo;

    public PaymentServiceImpl(PaymentRepository paymentRepo) {
        this.paymentRepo = paymentRepo;
    }

    @Override
    public JSONObject createOrder(Map<String, Object> data) {
        JSONObject orderResponse = new JSONObject();
        try {
            int amount = Integer.parseInt(data.get("amount").toString()) * 100; // Convert to paise

            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpaySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = client.Orders.create(orderRequest);


            orderResponse.put("id", (String) order.get("id"));
            orderResponse.put("amount", ((Number) order.get("amount")).intValue());
            orderResponse.put("currency", (String) order.get("currency"));
            orderResponse.put("status", (String) order.get("status"));

        } catch (Exception e) {
            e.printStackTrace();
            orderResponse.put("error", "Failed to create order: " + e.getMessage());
        }
        return orderResponse;
    }

    @Override
    public Payment savePayment(Payment payment) {
        return paymentRepo.save(payment);
    }
}
