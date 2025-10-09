package aviyanadivine.aviyana.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name="products")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString

public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private String image_url;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updated_at = LocalDateTime.now();
    }

}
