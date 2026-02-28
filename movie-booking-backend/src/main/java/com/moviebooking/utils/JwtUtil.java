package com.moviebooking.utils;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Utility class for JWT (JSON Web Token) operations.
 * 
 * <p>This class provides functionality for creating, validating, and extracting
 * information from JWT tokens used for user authentication.</p>
 * 
 * <p>The JWT tokens contain:</p>
 * <ul>
 *   <li>User ID as the subject</li>
 *   <li>User role as a custom claim</li>
 *   <li>Issued at timestamp</li>
 *   <li>Expiration timestamp</li>
 * </ul>
 * 
 * <p>Configuration properties:</p>
 * <ul>
 *   <li><strong>jwt.secret</strong>: Secret key for signing tokens (Base64 encoded)</li>
 *   <li><strong>jwt.expiration</strong>: Token expiration time in milliseconds</li>
 * </ul>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Component
public class JwtUtil {
    
    /**
     * Secret key for signing JWT tokens.
     * Must be Base64 encoded and at least 256 bits (32 bytes) long.
     */
    @Value("${jwt.secret}")
    private String secret;
    
    /**
     * Token expiration time in milliseconds.
     * Default is 24 hours (86400000 ms).
     */
    @Value("${jwt.expiration}")
    private int jwtExpiration;
    
    /**
     * Extracts the username (user ID) from a JWT token.
     * 
     * @param token the JWT token to extract the username from
     * @return the user ID from the token subject
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    /**
     * Extracts a specific claim from a JWT token using a claims resolver function.
     * 
     * @param <T> the type of the claim to extract
     * @param token the JWT token to extract the claim from
     * @param claimsResolver function to resolve the specific claim
     * @return the extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    /**
     * Generates a JWT token for a user with their role.
     * 
     * @param userId the user ID to include as the token subject
     * @param role the user's role to include as a custom claim
     * @return the generated JWT token
     */
    public String generateToken(String userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, userId);
    }
    
    /**
     * Creates a JWT token with the specified claims and subject.
     * 
     * @param claims the claims to include in the token
     * @param subject the subject (user ID) of the token
     * @return the created JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    /**
     * Validates if a JWT token is valid for a specific user.
     * 
     * @param token the JWT token to validate
     * @param userId the user ID to validate against
     * @return true if the token is valid for the user, false otherwise
     */
    public Boolean isTokenValid(String token, String userId) {
        final String username = extractUsername(token);
        return (username.equals(userId)) && !isTokenExpired(token);
    }
    
    /**
     * Checks if a JWT token has expired.
     * 
     * @param token the JWT token to check
     * @return true if the token has expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    /**
     * Extracts the expiration date from a JWT token.
     * 
     * @param token the JWT token to extract the expiration from
     * @return the expiration date of the token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    /**
     * Extracts all claims from a JWT token.
     * 
     * @param token the JWT token to extract claims from
     * @return all claims from the token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * Gets the signing key for JWT operations.
     * 
     * @return the signing key derived from the secret
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}