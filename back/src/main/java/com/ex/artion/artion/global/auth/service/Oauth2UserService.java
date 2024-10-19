package com.ex.artion.artion.global.auth.service;

import com.ex.artion.artion.global.auth.repository.AuthRepository;
import com.ex.artion.artion.global.jwt.UserPrincipal;
import com.ex.artion.artion.global.jwt.KakaoUserInfo;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class Oauth2UserService extends DefaultOAuth2UserService {

    private final AuthRepository authRepository;
    private final UserRepository userRepository;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String KAKAO_REST_API_KEY;

    private static final Logger logger = LoggerFactory.getLogger(Oauth2UserService.class);

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 1, kakao 서버로부터 유저 정보 받기
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String kakao_id = oAuth2User.getAttributes().get("id").toString();
        String name = (String) ((Map<?, ?>) oAuth2User.getAttributes().get("properties")).get("nickname");
        String image = (String) ((Map<?, ?>) oAuth2User.getAttributes().get("properties")).get("profile_image");

        System.out.println(oAuth2User);
        System.out.println("kakao에서 유저 정보 받아옴 : " + kakao_id + " " + name + " " + image);

        // 2. 기존 회원인지 체크하고 회원가입

        KakaoUserInfo kakaoUserInfo = KakaoUserInfo.ofKakao(oAuth2User.getAttributes());;

        UserEntity userEntity = authRepository.findByKakao_pk(kakao_id)
                .orElseGet(() -> userRepository.save(kakaoUserInfo.toEntity()));


//        UserEntity userEntity = authRepository.findByKakao_pk(kakao_id)
//                .orElseGet(() -> {
//                   UserEntity newUser = new UserEntity();
//                    newUser.setKakao_pk(kakao_id);
//                    newUser.setUser_name(name);
//                    newUser.setKakao_image(image);
//
//                    return authRepository.save(newUser);
//                });

        System.out.println("oauth2 userEntity : {}" + userEntity);

        return new UserPrincipal(userEntity, oAuth2User.getAttributes());
    }

    public UserDetails loadUserByPk(Integer userPk) {
        UserEntity user = authRepository.findById(userPk).orElseThrow(
                () -> new UsernameNotFoundException("id에 해당하는 User 없음")
        );

        return UserPrincipal.create(user);
    }
}

//        String accessToken = userRequest.getAccessToken().getTokenValue();
//
//        // RestTemplate으로 사용자 정보 가져오기
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "Bearer " + accessToken);
//        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
//
//        RestTemplate rt = new RestTemplate();
//        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest = new HttpEntity<>(headers);
//
//        ResponseEntity<String> response = rt.exchange(
//                "https://kapi.kakao.com/v2/user/me",
//                HttpMethod.GET,
//                kakaoProfileRequest,
//                String.class
//        );
//
//        try {
//            // JSON 파싱
//            String responseBody = response.getBody();
//            JsonNode jsonNode = new ObjectMapper().readTree(responseBody);
//            String kakaoPk = jsonNode.get("id").toString();
//            String nickname = jsonNode.get("properties").get("nickname").asText();
//            String picture = jsonNode.get("properties").get("thumbnail_image").asText();
//            System.out.println("카카오 PK: " + kakaoPk);
//            System.out.println("닉네임: " + nickname);
//            System.out.println("프로필 이미지: " + picture);
//
//            // 기존 회원인지 조회
//            if (authRepository.findByKakao_pk(kakaoPk) != null) {
//                System.out.println("기존 회원입니다.");
//                // 메인 페이지로 이동하도록 로직 추가
//            } else {
//                System.out.println("기존 회원이 아닙니다. 추가 정보 입력 페이지로 이동.");
//                // 추가 정보 입력 페이지로 이동하는 로직 추가
//            }
//
//            // OAuth2User 객체에 정보 넣기 (필요한 대로 수정 가능)
//            Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());
//            attributes.put("kakao_pk", kakaoPk);
//            attributes.put("nickname", nickname);
//            attributes.put("picture", picture);
//
//            return new DefaultOAuth2User(
//                    oAuth2User.getAuthorities(),
//                    attributes,
//                    "id"); // primary key로 사용할 attribute
//
//        } catch (IOException e) {
//            throw new RuntimeException("카카오 사용자 정보 파싱에 실패했습니다.", e);
//        }