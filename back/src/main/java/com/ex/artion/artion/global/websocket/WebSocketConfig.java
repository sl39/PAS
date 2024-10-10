package com.ex.artion.artion.global.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@EnableWebSocketMessageBroker
@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer  {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/api/socket/ws") //소켓으로 연결할 url
                .setAllowedOriginPatterns("*");
        registry.addEndpoint("/api/socket/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

    }
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub"); // 구독할 url
        registry.setApplicationDestinationPrefixes("/pub"); // 메시지를 보낼 url
    }

}
