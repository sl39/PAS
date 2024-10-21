package com.ex.artion.artion.global.auth.service;

import com.ex.artion.artion.global.auth.repository.AuthRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplateBuilder restTemplateBuilder;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String KAKAO_REST_API_KEY;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

//    public ResponseEntity<?> kakaoLogin() {
//        OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
//        OAuth2AuthorizedClient client = this.authorizedClientService.loadAuthorizedClient(
//                "kakao", oAuth2Token.getName());
//
//        String accessToken = client.getAccessToken().getTokenValue();
//
//        RestTemplate restTemplate = new RestTemplate();
//        HttpHeaders headers = new HttpHeaders();
//        headers.setBearerAuth(accessToken);
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<Map> response = restTemplate.exchange(
//                "https://kapi.kakao.com/v2/user/me",
//                HttpMethod.GET,
//                entity,
//                Map.class);
//
//        Map<String, Object> userInfo = response.getBody();
//    }

    //카카오 소셜로그인 인가 코드 받기.
    public Map<String, Object> getAccessToken(String code) {
        String kakaoURL = "https://kauth.kakao.com/oauth/token";
        String access_token = "";
        String refresh_token = "";
        Map<String, Object> tokens = new HashMap<>();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // MediaType.APPLICATION_FORM_URLENCODED == application/x-www-form-urlencoded;charset=utf-8

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", KAKAO_REST_API_KEY);
        params.add("redirect_uri", "http://localhost:8080/oauth2/loginSuccess");
        params.add("code", code);

        System.out.println("요청 : " + params);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> response = restTemplateBuilder.build().exchange(
                kakaoURL,
                HttpMethod.POST,
                request,
                String.class
        );

        System.out.println("토큰 + 유효기간 : " + response.getBody());

        if (response.getStatusCode() == HttpStatus.OK) {
            String result = response.getBody();

            try {
                // ObjectMapper를 이용해 JSON 파싱
                JsonNode jsonNode = objectMapper.readTree(result);
                access_token = jsonNode.get("access_token").asText();
                tokens.put("access_token", access_token);
                refresh_token = jsonNode.get("refresh_token").asText();
                tokens.put("refresh_token", refresh_token);
            } catch (IOException e) {
                logger.error("Failed to parse JSON", e);
            }
        }
        System.out.println(tokens);
        return tokens;
    }

    public void loginWithAccessToken(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        RestTemplate rt = new RestTemplate();
        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest = new HttpEntity<>(headers);

        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                kakaoProfileRequest,
                String.class
        );

        try {
            String responseBody = response.getBody();
            // JSON 파싱
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            String kakao_pk = jsonNode.get("id").toString();
            String nickname = jsonNode.get("properties").get("nickname").asText();
            String picture = jsonNode.get("properties").get("thumbnail_image").asText();
            System.out.println(nickname);
            System.out.println(picture);

//            String nickname = jsonNode.get("kakao_account").get("profile").get("nickname").asText();
//            String picture = jsonNode.get("kakao_account").get("profile").get("thumbnail_image_url").asText();

            // 기존 회원인지 조회
            if (authRepository.findByKakao_pk(kakao_pk) != null) {
                //메인페이지로 이동.
                // return "redirect:/mainPage"
                System.out.println("기존 회원이니? : YES" + responseBody);
            } else {
                // 추가 정보 페이지로 이동 + .
//                 return "redirect:/signup?kakao_pk=" + kakao_pk + "&nickname=" + nickname + "&picture=" + picture;
                System.out.println("기존 회원이니? : NO" + responseBody);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Kakao profile", e);
        }
    }
}






//    public String getKakaoAccessToken (String code) {
//        String accessToken = "";
//        String refreshToken = "";
//        String requestURL = "https://kauth.kakao.com/oauth/token";
//
//        try {
//            URL url = new URL(requestURL);
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//
//            conn.setRequestMethod("POST");
//            // setDoOutput()은 OutputStream으로 POST 데이터를 넘겨 주겠다는 옵션이다.
//            // POST 요청을 수행하려면 setDoOutput()을 true로 설정한다.
//            conn.setDoOutput(true);
//
//            // POST 요청에서 필요한 파라미터를 OutputStream을 통해 전송
//            BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
//            String sb = "grant_type=authorization_code" +
//                    "&client_id=REST_API_KEY 입력" + // REST_API_KEY
//                    "&redirect_uri=http://localhost:8080/app/login/kakao" + // REDIRECT_URI
//                    "&code=" + code;
//            bufferedWriter.write(sb);
//            bufferedWriter.flush();
//
//            int responseCode = conn.getResponseCode();
//            System.out.println("responseCode : " + responseCode);
//
//            // 요청을 통해 얻은 데이터를 InputStreamReader을 통해 읽어 오기
//            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
//            String line = "";
//            StringBuilder result = new StringBuilder();
//
//            while ((line = bufferedReader.readLine()) != null) {
//                result.append(line);
//            }
//            System.out.println("response body : " + result);
//
//            JsonElement element = JsonParser.parseString(result.toString());
//
//            accessToken = element.getAsJsonObject().get("access_token").getAsString();
//            refreshToken = element.getAsJsonObject().get("refresh_token").getAsString();
//
//            System.out.println("accessToken : " + accessToken);
//            System.out.println("refreshToken : " + refreshToken);
//
//            bufferedReader.close();
//            bufferedWriter.close();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//
//        return accessToken;
//    }
//
//
//    public HashMap<String, Object> getUserInfo(String accessToken) {
//        HashMap<String, Object> userInfo = new HashMap<>();
//        String postURL = "https://kapi.kakao.com/v2/user/me";
//
//        try {
//            URL url = new URL(postURL);
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//            conn.setRequestMethod("POST");
//
//            conn.setRequestProperty("Authorization", "Bearer " + accessToken);
//
//            int responseCode = conn.getResponseCode();
//            System.out.println("responseCode : " + responseCode);
//
//            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
//            String line = "";
//            StringBuilder result = new StringBuilder();
//
//            while ((line = br.readLine()) != null) {
//                result.append(line);
//            }
//            System.out.println("response body : " + result);
//
//            JsonElement element = JsonParser.parseString(result.toString());
//            JsonObject properties = element.getAsJsonObject().get("properties").getAsJsonObject();
//            JsonObject kakaoAccount = element.getAsJsonObject().get("kakao_account").getAsJsonObject();
//
//            String nickname = properties.getAsJsonObject().get("nickname").getAsString();
//            String email = kakaoAccount.getAsJsonObject().get("email").getAsString();
//
//            userInfo.put("nickname", nickname);
//            userInfo.put("email", email);
//
//        } catch (IOException exception) {
//            exception.printStackTrace();
//        }
//
//        return userInfo;
//    }

//    public String refreshAccessToken(String refreshToken) throws JsonProcessingException {
//        // 리프레시 토큰을 사용하여 새로운 액세스 토큰 요청
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("grant_type", "refresh_token");
//        params.add("client_id", KAKAO_REST_API_KEY);
//        params.add("refresh_token", refreshToken);
//
//        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
//        ResponseEntity<String> response = restTemplateBuilder.build().exchange(("https://kauth.kakao.com/oauth/token"), HttpMethod.POST, request, String.class);
//
//        if (response.getStatusCode() == HttpStatus.OK) {
//            JsonNode jsonNode = objectMapper.readTree(response.getBody());
//            return jsonNode.get("access_token").asText();
//        }
//        return null; // 오류 처리
//    }}

//    public void getAccessTokenAndProfile(String code) {
//        // Step 1: Access token을 요청
//        String accessToken = getAccessToken(code);
//
//        if (accessToken != null && !accessToken.isEmpty()) {
//            // Step 2: 사용자 프로필 정보 요청
//            try {
//                String profileData = getUserProfile(accessToken);
//                JSONObject profileJson = parseJSON(profileData);
//                // 필요한 데이터 추출
//                JSONObject kakaoAccount = (JSONObject) profileJson.get("kakao_account");
//                JSONObject profile = (JSONObject) kakaoAccount.get("profile");
//                String nickname = (String) profile.get("nickname");
//                String profileImage = (String) profile.get("profile_image");
//
//                System.out.println("Nickname: " + nickname);
//                System.out.println("Profile Image: " + profileImage);
//            } catch (JSONException e) {
//                e.printStackTrace();
//            } catch (IOException e) {
//                throw new RuntimeException(e);
//            }
//        } else {
//            System.out.println("Access token을 받지 못했습니다.");
//        }
//    }
//
//    private String getUserProfile(String accessToken) throws IOException {
//        String kakaoProfileUrl = "https://kapi.kakao.com/v2/user/me"; // 사용자 프로필 API URL
//
//        URL url = new URL(kakaoProfileUrl);
//        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//        connection.setRequestMethod("GET");
//        connection.setDoOutput(true);
//        connection.setRequestProperty("Authorization", "Bearer " + accessToken);
//
//        int responseCode = connection.getResponseCode();
//        if (responseCode == 200) {
//            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//            StringBuilder response = new StringBuilder();
//            String line;
//
//            while ((line = br.readLine()) != null) {
//                response.append(line);
//            }
//            br.close();
//
//            return response.toString(); // JSON 형식의 응답 데이터 반환
//        } else {
//            System.out.println("사용자 프로필 정보를 가져오는 데 실패했습니다. 응답 코드: " + responseCode);
//            return null;
//        }
//    }

//package com.ex.artion.artion.global.auth.service;
//
//import com.ex.artion.artion.global.auth.dto.AuthDto;
//import com.ex.artion.artion.global.auth.repository.AuthRepository;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.web.client.RestTemplateBuilder;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.web.client.RestTemplate;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import java.io.*;
//import java.util.HashMap;
//import java.util.Map;
//
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//
//@RequiredArgsConstructor
//@Service
//public class AuthServiceImpl implements AuthService {
//    private final AuthRepository authRepository;
//    private final ObjectMapper objectMapper;
//    private final RestTemplateBuilder restTemplateBuilder;
//
//    @Value("${spring.kakao.api.RESTAPI}")
//    private String KAKAO_REST_API_KEY;
//
//    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
//
//    //카카오 소셜로그인 인가 코드 받기.
//    @Override
//    public Map<String, Object> getAccessToken(String code) {
//        String kakaoURL = "https://kauth.kakao.com/oauth/token";
//        String access_token = "";
//        String refresh_token = "";
//        Map<String, Object> tokens = new HashMap<>();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED); // MediaType.APPLICATION_FORM_URLENCODED == application/x-www-form-urlencoded;charset=utf-8
//
//        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("grant_type", "authorization_code");
//        params.add("client_id", KAKAO_REST_API_KEY);
//        params.add("redirect_uri", "http://localhost:8080/oauth/callback/kakao");
//        params.add("code", code);
//
//        System.out.println("요청 : http://localhost:8080/oauth/callback/kakao : " + params);
//
//        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
//
//        ResponseEntity<String> response = restTemplateBuilder.build().exchange(
//                kakaoURL,
//                HttpMethod.POST,
//                request,
//                String.class
//        );
//
//        System.out.println("토큰 + 유효기간 : " + response.getBody());
//
//        if (response.getStatusCode() == HttpStatus.OK) {
//            String result = response.getBody();
//
//            try {
//                // ObjectMapper를 이용해 JSON 파싱
//                JsonNode jsonNode = objectMapper.readTree(result);
//                access_token = jsonNode.get("access_token").asText();
//                tokens.put("access_token", access_token);
//                refresh_token = jsonNode.get("refresh_token").asText();
//                tokens.put("refresh_token", refresh_token);
//            } catch (IOException e) {
//                logger.error("Failed to parse JSON", e);
//            }
//        }
//        System.out.println(tokens);
//        return tokens;
//    }
//
//    @Override
//    public void loginWithAccessToken(String token) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "Bearer " + token);
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
//            String responseBody = response.getBody();
//            // JSON 파싱
//            JsonNode jsonNode = objectMapper.readTree(responseBody);
//            String kakao_pk = jsonNode.get("id").toString();
//            String nickname = jsonNode.get("properties").get("nickname").asText();
//            String picture = jsonNode.get("properties").get("thumbnail_image").asText();
//            System.out.println(nickname);
//            System.out.println(picture);
//
////            String nickname = jsonNode.get("kakao_account").get("profile").get("nickname").asText();
////            String picture = jsonNode.get("kakao_account").get("profile").get("thumbnail_image_url").asText();
//
//            // 기존 회원인지 조회
//            if (authRepository.findByKakao_pk(kakao_pk) != null) {
//                //메인페이지로 이동.
//                // return "redirect:/mainPage"
//                System.out.println("기존 회원이니? : YES" + responseBody);
//            } else {
//                // 추가 정보 페이지로 이동 + .
////                 return "redirect:/signup?kakao_pk=" + kakao_pk + "&nickname=" + nickname + "&picture=" + picture;
//                System.out.println("기존 회원이니? : NO" + responseBody);
//            }
//
//        } catch (IOException e) {
//            throw new RuntimeException("Failed to parse Kakao profile", e);
//        }
//    }
//}
//
////    public String refreshAccessToken(String refreshToken) throws JsonProcessingException {
////        // 리프레시 토큰을 사용하여 새로운 액세스 토큰 요청
////        HttpHeaders headers = new HttpHeaders();
////        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
////
////        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
////        params.add("grant_type", "refresh_token");
////        params.add("client_id", KAKAO_REST_API_KEY);
////        params.add("refresh_token", refreshToken);
////
////        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
////        ResponseEntity<String> response = restTemplateBuilder.build().exchange(("https://kauth.kakao.com/oauth/token"), HttpMethod.POST, request, String.class);
////
////        if (response.getStatusCode() == HttpStatus.OK) {
////            JsonNode jsonNode = objectMapper.readTree(response.getBody());
////            return jsonNode.get("access_token").asText();
////        }
////        return null; // 오류 처리
////    }}
//
////    public void getAccessTokenAndProfile(String code) {
////        // Step 1: Access token을 요청
////        String accessToken = getAccessToken(code);
////
////        if (accessToken != null && !accessToken.isEmpty()) {
////            // Step 2: 사용자 프로필 정보 요청
////            try {
////                String profileData = getUserProfile(accessToken);
////                JSONObject profileJson = parseJSON(profileData);
////                // 필요한 데이터 추출
////                JSONObject kakaoAccount = (JSONObject) profileJson.get("kakao_account");
////                JSONObject profile = (JSONObject) kakaoAccount.get("profile");
////                String nickname = (String) profile.get("nickname");
////                String profileImage = (String) profile.get("profile_image");
////
////                System.out.println("Nickname: " + nickname);
////                System.out.println("Profile Image: " + profileImage);
////            } catch (JSONException e) {
////                e.printStackTrace();
////            } catch (IOException e) {
////                throw new RuntimeException(e);
////            }
////        } else {
////            System.out.println("Access token을 받지 못했습니다.");
////        }
////    }
////
////    private String getUserProfile(String accessToken) throws IOException {
////        String kakaoProfileUrl = "https://kapi.kakao.com/v2/user/me"; // 사용자 프로필 API URL
////
////        URL url = new URL(kakaoProfileUrl);
////        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
////        connection.setRequestMethod("GET");
////        connection.setDoOutput(true);
////        connection.setRequestProperty("Authorization", "Bearer " + accessToken);
////
////        int responseCode = connection.getResponseCode();
////        if (responseCode == 200) {
////            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
////            StringBuilder response = new StringBuilder();
////            String line;
////
////            while ((line = br.readLine()) != null) {
////                response.append(line);
////            }
////            br.close();
////
////            return response.toString(); // JSON 형식의 응답 데이터 반환
////        } else {
////            System.out.println("사용자 프로필 정보를 가져오는 데 실패했습니다. 응답 코드: " + responseCode);
////            return null;
////        }
////    }