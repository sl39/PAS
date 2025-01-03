package com.ex.artion.artion.following.service;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.following.entity.FollowingEntity;
import com.ex.artion.artion.following.respository.FollowingRepository;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.global.jwt.UserPrincipal;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowingService {
    public final FollowingRepository followingRepository;
    public final UserRepository userRepository;

    @Transactional
    public void follow (UserEntity seller) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserEntity user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if(user.equals(seller)) {
            throw new IllegalArgumentException("자기자신은 팔로우 안됌");
        }
        if ( followingRepository.findByCustomerAndSeller(user, seller).isPresent()) {
            throw new IllegalArgumentException("already following");
        }
        FollowingEntity followingEntity = new FollowingEntity();
        followingEntity.setCustomer(user);
        followingEntity.setSeller(seller);
        followingRepository.save(followingEntity);
    }
    @Transactional
    public void unfollow (UserEntity seller) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserEntity user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        FollowingEntity following = followingRepository.findByCustomerAndSeller(user,seller)
                .orElseThrow(() -> new IllegalArgumentException("not follow."));
        followingRepository.delete(following);
    }

    public List<FollowingEntity> getFollowingsByCustomer(UserEntity customer) {
        return followingRepository.findByCustomer(customer);
    }

    public List<FollowingEntity> getFollowingsBySeller(UserEntity seller) {
        return followingRepository.findBySeller(seller);
    }
}
