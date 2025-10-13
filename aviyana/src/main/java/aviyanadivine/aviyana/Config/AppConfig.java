package aviyanadivine.aviyana.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


@Configuration
public class AppConfig {


   @Bean
   UserDetailsService userDetailsService(){
        UserDetails userDetailsOne= User.withUsername("User1")
                .password(passwordEncoder().encode("Pass1"))
                .build();

        UserDetails userDetailsTwo=User.withUsername("User2")
                .password(passwordEncoder().encode("Pass2"))
                .build();
        UserDetails admin=User.withUsername("Admin")
                .password(passwordEncoder().encode("Admin1"))
                .build();

        return new InMemoryUserDetailsManager(userDetailsOne,userDetailsTwo, admin);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(csrfCustomizer -> csrfCustomizer.disable());
        httpSecurity.cors(Customizer.withDefaults());  // enable CORS
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers("/api/auth/signup", "/api/auth/login", "/api/products", "/api/shipping", "/api/payment").permitAll()
                        .anyRequest().authenticated());

        httpSecurity.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return httpSecurity.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("https://aviyanadivine-mpcg.vercel.app"); // your frontend URL
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }


    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
