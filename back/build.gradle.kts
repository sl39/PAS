plugins {
	java
	id("org.springframework.boot") version "3.3.4"
	id("io.spring.dependency-management") version "1.1.6"
}

group = "com.ex.artion"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("com.mysql:mysql-connector-j")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	implementation("net.datafaker:datafaker:2.4.0")
	implementation ("org.springframework.boot:spring-boot-starter-websocket")

	//로그인, 권한관련
	implementation("org.springframework.boot:spring-boot-starter-oauth2-authorization-server")
	implementation("org.springframework.boot:spring-boot-starter-security")
	//인가코드 받고 액세스 토큰, 리프레쉬 토큰 받기 위해 사용
	implementation("org.json:json:20231013")
	implementation("com.googlecode.json-simple:json-simple:1.1.1")

	//OAuth 2.0 client && spring-security
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
	implementation("org.springframework.boot:spring-boot-starter-web")
//	implementation("org.springframework.security:spring-security-oauth2-client")
//	implementation("org.springframework.security:spring-security-oauth2-client:6.2.4")
//	implementation("org.springframework.security.oauth.boot:spring-security-oauth2-autoconfigure:2.6.8")

	//jjwt 관련
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

}

tasks.withType<Test> {
	useJUnitPlatform()
}
