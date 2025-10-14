package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.Product;
import aviyanadivine.aviyana.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProductServiceImpl implements  ProductService{

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
         return productRepository.findAll();
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        Product existing=productRepository.findById(id).orElseThrow();
        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setQuantity(product.getQuantity());
        existing.setImageUrl(product.getImageUrl());
        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(Long id) {
 productRepository.deleteById((id));
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }
}
