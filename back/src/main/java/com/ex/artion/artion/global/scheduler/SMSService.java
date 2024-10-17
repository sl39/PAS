package com.ex.artion.artion.global.scheduler;

import lombok.RequiredArgsConstructor;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SMSService {

    private final DefaultMessageService messageService;

    public SMSService(@Value("${external.coolsms.apikey}") String API_KEY,
                      @Value("${external.coolsms.apisecret}") String API_SECRET) {

        this.messageService = NurigoApp.INSTANCE.initialize(API_KEY, API_SECRET, "https://api.coolsms.co.kr");
    }
}
