package com.ex.artion.artion.global.scheduler;

import com.ex.artion.artion.global.scheduler.SMSDto.OrderCompleteDto;
import com.ex.artion.artion.global.scheduler.SMSDto.OrderSellingComplete;
import com.ex.artion.artion.order.entity.OrderEntity;
import com.ex.artion.artion.paying.entity.PayingEntity;
import lombok.RequiredArgsConstructor;

import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.model.KakaoOption;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class SMSService {

    private final DefaultMessageService messageService;

    @Value("${external.coolsms.channelid}")
    private String channelId;

    @Value("${external.coolsms.orderid}")
    private String orderId;

    @Value("${external.coolsms.ordersellid}")
    private String ordersellingId;

    @Value("${external.coolsms.resttime}")
    private String rest_time;

    @Value("${external.coolsms.sendfrom}")
    private String sendFrom;

    @Value("${external.coolsms.sendto}")
    private String sendTo;

    @Value("${external.coolsms.nobid}")
    private String nobid;

    @Value("${external.coolsms.endtime}")
    private String endTime;


    public SMSService(@Value("${external.coolsms.apikey}") String API_KEY,
                      @Value("${external.coolsms.apisecret}") String API_SECRET) {

        this.messageService = NurigoApp.INSTANCE.initialize(API_KEY, API_SECRET, "https://api.coolsms.co.kr");
    }

    // 구매자 결제 완료 메시지
    public void orderPaymentComplete(OrderCompleteDto order){
        KakaoOption kakaoOption = new KakaoOption();
        // disableSms를 true로 설정하실 경우 문자로 대체발송 되지 않습니다.
        // kakaoOption.setDisableSms(true);

        // 등록하신 카카오 비즈니스 채널의 pfId를 입력해주세요.
        kakaoOption.setPfId(channelId);
        // 등록하신 카카오 알림톡 템플릿의 templateId를 입력해주세요.
        kakaoOption.setTemplateId(orderId);

        // 알림톡 템플릿 내에 #{변수} 형태가 존재할 경우 variables를 설정해주세요.
        /*
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{변수명1}", "테스트");
        variables.put("#{변수명2}", "치환문구 테스트2");
        kakaoOption.setVariables(variables);
        */
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{art_name}", order.getArt_name());
        variables.put("#{order_num}", order.getOrder_num());
        variables.put("#{art_price}", String.valueOf(order.getArt_price()));
        variables.put("#{order_date}", order.getOrder_date());
        kakaoOption.setVariables(variables);


        Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom(sendFrom);
        message.setTo(sendTo);
        message.setKakaoOptions(kakaoOption);

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
        System.out.println(response);
    }


    // 판매자 결제 완료 메시지
    public void orderSellComplete(OrderSellingComplete order){
        KakaoOption kakaoOption = new KakaoOption();
        // disableSms를 true로 설정하실 경우 문자로 대체발송 되지 않습니다.
        // kakaoOption.setDisableSms(true);

        // 등록하신 카카오 비즈니스 채널의 pfId를 입력해주세요.
        kakaoOption.setPfId(channelId);
        // 등록하신 카카오 알림톡 템플릿의 templateId를 입력해주세요.
        kakaoOption.setTemplateId(ordersellingId);

        // 알림톡 템플릿 내에 #{변수} 형태가 존재할 경우 variables를 설정해주세요.
        /*
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{변수명1}", "테스트");
        variables.put("#{변수명2}", "치환문구 테스트2");
        kakaoOption.setVariables(variables);
        */
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{art_name}", order.getArt_name());
        variables.put("#{order_num}", order.getOrder_num());
        variables.put("#{art_price}", String.valueOf(order.getArt_price()));
        variables.put("#{order_date}", order.getOrder_date());
        kakaoOption.setVariables(variables);


        Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom(sendFrom);
        message.setTo(sendTo);
        message.setKakaoOptions(kakaoOption);

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
    }
    
    // 구매자에게 남은 시간 알림
    public void restTimeToPay(String artName, String phone_number){
        KakaoOption kakaoOption = new KakaoOption();
        // disableSms를 true로 설정하실 경우 문자로 대체발송 되지 않습니다.
        // kakaoOption.setDisableSms(true);

        // 등록하신 카카오 비즈니스 채널의 pfId를 입력해주세요.
        kakaoOption.setPfId(channelId);
        // 등록하신 카카오 알림톡 템플릿의 templateId를 입력해주세요.
        kakaoOption.setTemplateId(rest_time);

        // 알림톡 템플릿 내에 #{변수} 형태가 존재할 경우 variables를 설정해주세요.
        /*
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{변수명1}", "테스트");
        variables.put("#{변수명2}", "치환문구 테스트2");
        kakaoOption.setVariables(variables);
        */
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{art_name}", artName);
        kakaoOption.setVariables(variables);


        Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom(sendFrom);
        message.setTo(sendTo);
        message.setKakaoOptions(kakaoOption);

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
    }

    // 판매자에게 입찰자가 없다고 알림
    public void noBid(String artName, String phone_number){
        KakaoOption kakaoOption = new KakaoOption();
        // disableSms를 true로 설정하실 경우 문자로 대체발송 되지 않습니다.
        // kakaoOption.setDisableSms(true);

        // 등록하신 카카오 비즈니스 채널의 pfId를 입력해주세요.
        kakaoOption.setPfId(channelId);
        // 등록하신 카카오 알림톡 템플릿의 templateId를 입력해주세요.
        kakaoOption.setTemplateId(nobid);

        // 알림톡 템플릿 내에 #{변수} 형태가 존재할 경우 variables를 설정해주세요.
        /*
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{변수명1}", "테스트");
        variables.put("#{변수명2}", "치환문구 테스트2");
        kakaoOption.setVariables(variables);
        */
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{art_name}", artName);
        kakaoOption.setVariables(variables);


        Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom(sendFrom);
        message.setTo(sendTo);
        message.setKakaoOptions(kakaoOption);

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
    }

    // 구매자에게 구매 시간이 종료되었음을 알림
    public void endTime(String artName, String phone_number){
        KakaoOption kakaoOption = new KakaoOption();
        // disableSms를 true로 설정하실 경우 문자로 대체발송 되지 않습니다.
        // kakaoOption.setDisableSms(true);

        // 등록하신 카카오 비즈니스 채널의 pfId를 입력해주세요.
        kakaoOption.setPfId(channelId);
        // 등록하신 카카오 알림톡 템플릿의 templateId를 입력해주세요.
        kakaoOption.setTemplateId(endTime);

        // 알림톡 템플릿 내에 #{변수} 형태가 존재할 경우 variables를 설정해주세요.
        /*
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{변수명1}", "테스트");
        variables.put("#{변수명2}", "치환문구 테스트2");
        kakaoOption.setVariables(variables);
        */
        HashMap<String, String> variables = new HashMap<>();
        variables.put("#{art_name}", artName);
        kakaoOption.setVariables(variables);


        Message message = new Message();
        // 발신번호 및 수신번호는 반드시 01012345678 형태로 입력되어야 합니다.
        message.setFrom(sendFrom);
        message.setTo(sendTo);
        message.setKakaoOptions(kakaoOption);

        SingleMessageSentResponse response = this.messageService.sendOne(new SingleMessageSendingRequest(message));
    }
}
