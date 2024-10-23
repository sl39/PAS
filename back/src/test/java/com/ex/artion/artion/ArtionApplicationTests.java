package com.ex.artion.artion;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.artcategory.entity.ArtArtCategory;
import com.ex.artion.artion.artcategory.entity.ArtCategoryEntity;
import com.ex.artion.artion.artcategory.respository.ArtArtCategoryRepository;
import com.ex.artion.artion.artcategory.respository.ArtCategoryRepository;
import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import com.ex.artion.artion.artimage.respository.ArtImageRepository;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import net.datafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@SpringBootTest
class ArtionApplicationTests {

	@Autowired
	private  ArtRepository artRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ArtImageRepository artImageRepository;

	@Autowired
	private ArtArtCategoryRepository artArtCategoryRepository;

	@Autowired
	private ArtCategoryRepository artCategoryRepository;

	@Test
	void contextLoads() {
	}

//	public List<ArtEntity> generateRandomArtAuctions(int count) {
//		Faker faker = new Faker();
//		Random random = new Random();
//		List<ArtEntity> auctions = new ArrayList<>();
//		Optional<UserEntity> user = userRepository.findById(2);
//		UserEntity userEntity = user.get();
//		for (int i = 0; i < count; i++) {
//			String art_name = faker.oscarMovie().movieName();
//			String art_info = faker.lorem().sentence();
//			Long minP = (long) (random.nextInt(5000) + 1000); // Random price between 1000 and 6000
//			Long maxP = minP + random.nextInt(5000); // Max price higher than min price
//			Double width = 50 + (100 - 50) * random.nextDouble(); // Random width between 50 and 100
//			Double depth = 10 + (50 - 10) * random.nextDouble(); // Random depth between 10 and 50
//			Double height = 20 + (80 - 20) * random.nextDouble(); // Random height between 20 and 80
//			Boolean qurator = random.nextBoolean();
//			LocalDate createdAt = LocalDate.now().minusDays(random.nextInt(1000)); // Random date in the past 1000 days
//			LocalDate upload = LocalDate.now().minusDays(random.nextInt(100)); // Random upload date in the past 100 days
//			LocalDateTime startTime = LocalDateTime.now().minusDays(random.nextInt(10)); // Random start time in the past 10 days
//			LocalDateTime endTime = startTime.plusDays(random.nextInt(5)); // End time a few days after start time
//			Integer current_auction_status = random.nextInt(5); // Random status between 0 and 4
//			String painter = faker.artist().name();
//
//			ArtEntity artEntity = ArtEntity.builder()
//					.art_name(art_name)
//					.art_info(art_info)
//					.minP(minP)
//					.maxP(maxP)
//					.width(width)
//					.depth(depth)
//					.height(height)
//					.qurator(qurator)
//					.createdAt(createdAt)
//					.upload(upload)
//					.startTime(startTime)
//					.endTime(endTime)
//					.current_auction_status(current_auction_status)
//					.painter(painter)
//					.userEntity(userEntity)
//					.build();
//
//			artRepository.save(artEntity);
//			for(int j = 1; j < 10; j++) {
//				ArtCategoryEntity en = artCategoryRepository.findById(j).orElse(null);
//
//				ArtArtCategory category = ArtArtCategory.builder()
//						.art(artEntity)
//						.art_category(en)
//						.build();
//
//				artArtCategoryRepository.save(category);
//			}
//
//			for (int j =0; j< 5 ; j ++ ){
//			 	String imageUrl = "https://avatars.githubusercontent.com/u/" + (random.nextInt(5000) + 1000);
//				ArtImageEntity image = ArtImageEntity.builder()
//						.art_entity(artEntity)
//						.art_image_url(imageUrl).build();
//				artImageRepository.save(image);
//			}
//		}
//
//		return auctions;
//	}

//	@Test
//	void test() {
//		List<ArtEntity> artEntities = generateRandomArtAuctions(5);
//	}

}
