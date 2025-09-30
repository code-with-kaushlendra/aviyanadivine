package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.User;
import aviyanadivine.aviyana.Repository.UserInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Override
    public String createUser(User user) {

        User user1=new User();
        BeanUtils.copyProperties(user,user1);
        userInfoRepository.save(user1);
        return "User Added Successfully";
    }

    @Override
    public boolean loginUser(User user) {
        Optional<User> found=userInfoRepository.findByEmailAndPassword(user.getEmail(),user.getPassword());
        return found.isPresent();
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
