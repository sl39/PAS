package com.ex.artion.artion.global.jwt;

import com.ex.artion.artion.user.entity.UserEntity;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Builder
@Data
public class KakaoUserInfo {

    private String kakao_id;
    private String name;
    private String image;

    private Map<String, Object> attributes;

    public static KakaoUserInfo ofKakao(Map<String, Object> attributes) {
        return KakaoUserInfo.builder()
                .kakao_id(attributes.get("id").toString())
                .name((String) ((Map<?, ?>) attributes.get("properties")).get("nickname"))
                .image((String) ((Map<?, ?>) attributes.get("properties")).get("profile_image"))
                .build();
    }

    public UserEntity toEntity() {
        return UserEntity.builder()
                .kakao_pk(kakao_id)
                .user_name(name)
                .kakao_image(image)
                .build();
    }
}
