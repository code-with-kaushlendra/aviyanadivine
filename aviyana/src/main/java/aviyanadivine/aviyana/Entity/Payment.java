package aviyanadivine.aviyana.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId;
    private String paymentId;
    private String status;
    private double amount;
    private String email;
    private String phone;
    private LocalDateTime paymentDate;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;


    // Getters and Setters
}
