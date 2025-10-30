package com.example.userservice.services;

import com.example.userservice.entities.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    // IMPORTANT: In a real app, this key should be long, random,
    // and stored securely (e.g., in environment variables)
    private static final String SECRET = "MySuperSecretKeyForJWTsThatIsLongEnoughToWork123";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Token is valid for 24 hours
    private static final long VALIDITY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

    public String generateToken(User user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + VALIDITY_IN_MILLISECONDS);

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId", user.getUserId())
                .claim("role", user.getRole())
                .issuedAt(now)
                .expiration(validity)
                .signWith(SECRET_KEY)
                .compact();
    }
}
