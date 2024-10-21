package com.ex.artion.artion.global.jwt;

import com.ex.artion.artion.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
public class UserPrincipal implements UserDetails, OAuth2User {

    private final UserEntity userEntity;
    private Map<String, Object> attributes;
//
//    private final String id;  // 카카오 고유 ID
//    private final String name;
//    private final String image;
    //private final List<? extends GrantedAuthority> authorities;
    //private final Map<String, Object> attributes;

    @Override
    public String getName() {
        return userEntity.getUser_pk().toString();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return userEntity.getUser_pk().toString();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }

    public static UserPrincipal create(UserEntity user) {

        return new UserPrincipal(user, new HashMap<>());
    }

    public UserPrincipal(
            UserEntity userEntity,
            Map<String, Object> attributes
    ) {
        this.userEntity = userEntity;
        this.attributes = attributes;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    public Integer getUserPk() {
        return userEntity.getUser_pk();
    }

}