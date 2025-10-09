package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.User;
import aviyanadivine.aviyana.Repository.UserInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Override
    public String createUser(User user) {
        User user1=new User();
        BeanUtils.copyProperties(user,user1);
        String encryptedPassword=passwordEncoder.encode(user1.getPassword());
        user1.setPassword(encryptedPassword);
        userInfoRepository.save(user1);
        return "User Added Successfully";
    }

    public boolean loginUser(User user) {
        Optional<User> found = userInfoRepository.findByEmail(user.getEmail());

        if (found.isPresent()) {
            User dbUser = found.get();

            // ✅ ONLY allow users (non-admin)
            if (!dbUser.isAdmin()) {
                return passwordEncoder.matches(user.getPassword(), dbUser.getPassword());
            }
            if (dbUser.isAdmin()) {
                return passwordEncoder.matches(user.getPassword(), dbUser.getPassword());
            }

            // ❌ If admin tries user login
            throw new RuntimeException("User Does Not exist");
        }

        return false;
    }

    @Override
    public Boolean getUserRole(String email) {
        Optional<User> userOpt = userInfoRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return userOpt.get().isAdmin();
        } else {
            return null; // or throw exception if preferred
        }
    }



//    @Override
//    public String loginUser(User user) {
//        String username = user.getUsername();  // ✅ Fixed
//        String password = user.getPassword();
//
//        Optional<User> userFound = userInfoRepository.findByUsernameAndPassword(username, password);
//
//        if (userFound.isPresent()) {
//            return "Login Successful";
//        } else {
//            return "Invalid Credentials";
//        }
//    }

}
