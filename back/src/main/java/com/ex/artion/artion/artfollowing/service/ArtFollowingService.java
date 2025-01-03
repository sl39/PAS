package com.ex.artion.artion.artfollowing.service;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.art.service.ArtService;
import com.ex.artion.artion.artfollowing.entity.ArtFollowingEntity;
import com.ex.artion.artion.artfollowing.respository.ArtFollowingRepository;
import com.ex.artion.artion.following.entity.FollowingEntity;
import com.ex.artion.artion.following.respository.FollowingRepository;
import com.ex.artion.artion.global.jwt.UserPrincipal;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import com.ex.artion.artion.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArtFollowingService {

    private final ArtFollowingRepository artfollowingRepository;
    private final ArtRepository artRepository;
    private final UserRepository userRepository;

    @Transactional
    public String Followingart(Integer artId) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

//        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity user = userRepository.findById(userPrincipal.getUserPk()).orElseThrow(() -> new RuntimeException("User not found"));
        ArtEntity art = artRepository.findById(artId).orElseThrow(() -> new RuntimeException("Art not found"));
        Optional<ArtFollowingEntity> existingLike = artfollowingRepository.findByUserEntityAndArtEntity(user, art);
        if (existingLike.isPresent()) {
            return "You have already followed this art!";
        }
        ArtFollowingEntity artFollowingEntity = new ArtFollowingEntity();
        artFollowingEntity.setUserEntity(user);
        artFollowingEntity.setArtEntity(art);
        artfollowingRepository.save(artFollowingEntity);
        return "liked good";
    }
    @Transactional
    public String unlikeartfollowing(Integer artId) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

//        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserEntity user = userRepository.findById(userPrincipal.getUserPk()).orElseThrow(() -> new RuntimeException("User not found"));
        ArtEntity art = artRepository.findById(artId).orElseThrow(() -> new RuntimeException("Art not found"));
        Optional<ArtFollowingEntity> existingLike = artfollowingRepository.findByUserEntityAndArtEntity(user, art);
        if(existingLike.isPresent()) {
            artfollowingRepository.deleteByUserEntityAndArtEntity(user, art);
            return "unliked";
        }
        else{
            return "not liked";
        }
    }

}
