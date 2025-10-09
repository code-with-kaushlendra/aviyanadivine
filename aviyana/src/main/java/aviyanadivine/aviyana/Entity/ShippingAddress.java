package aviyanadivine.aviyana.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="shippingaddress")
public class ShippingAddress {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private LocalDateTime updated_at;
        private LocalDateTime created_at;

        // Getters and Setters
    }


