package aviyanadivine.aviyana.Service;

import aviyanadivine.aviyana.Entity.PasswordResetToken;
import aviyanadivine.aviyana.Entity.User;
import aviyanadivine.aviyana.Repository.PasswordResetTokenRepository;
import aviyanadivine.aviyana.Repository.UserInfoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;


@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private JavaMailSender mailSender;




    @Override
    public String createUser(User user) {
        User user1=new User();
        BeanUtils.copyProperties(user,user1);
        String encryptedPassword=passwordEncoder.encode(user1.getPassword());
        user1.setPassword(encryptedPassword);
        user1.setAdmin(false);
        userInfoRepository.save(user1);
        return "User Added Successfully";
    }

    @Override
    public User loginUser(User user) {
        Optional<User> found = userInfoRepository.findByEmail(user.getEmail());

        if (found.isPresent()) {
            User dbUser = found.get();
            boolean passwordMatch = passwordEncoder.matches(user.getPassword(), dbUser.getPassword());

            if (passwordMatch) {
                return dbUser; // ✅ return user if password matches
            }
        }

        return null;
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

    @Override
    public boolean sendResetLink(String email) {
        Optional<User> userOpt = userInfoRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiry);
        tokenRepository.save(resetToken);

        String resetLink = "https://www.aviyanadivine.com/reset-password?token=" + token;


        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Click the link to reset your password:\n" + resetLink);
        mailSender.send(message);

        return true;
    }

    @Override
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) return false;

        PasswordResetToken resetToken = tokenOpt.get();

        if (resetToken.getExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userInfoRepository.save(user);

        tokenRepository.delete(resetToken); // Invalidate token
        return true;
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



