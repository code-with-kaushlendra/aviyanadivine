package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.Product;

import java.util.List;

public interface ProductService {
    Product addProduct(Product product);
    List<Product> getAllProducts();
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
    Product getProductById(Long id);


}
