package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.AdminProfile;
import aviyanadivine.aviyana.Repository.AdminProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminProfileServiceImpl implements AdminProfileService {

    @Autowired
    private AdminProfileRepository adminProfileRepository;

    @Override
    public AdminProfile updateAdmin(Long id, AdminProfile updatedAdmin) {
        AdminProfile existing = adminProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found with id: " + id));

        existing.setFirstname(updatedAdmin.getFirstname());
        existing.setLastname(updatedAdmin.getLastname());
        existing.setEmail(updatedAdmin.getEmail());
        existing.setPhonenumber(updatedAdmin.getPhonenumber());
        existing.setAddress(updatedAdmin.getAddress());
        existing.setImageUrl(updatedAdmin.getImageUrl());
        existing.setSpritualinterests(updatedAdmin.getSpritualinterests());

        return adminProfileRepository.save(existing);
    }
}
