package com.ex.artion.artion.art.respository;

import com.ex.artion.artion.art.dto.ArtSearchKeywordResponseDto;
import com.ex.artion.artion.art.dto.ArtSearchResponseDto;
import com.ex.artion.artion.art.entity.ArtEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArtRepository extends JpaRepository<ArtEntity, Integer> {

    @Query(value = "SELECT new com.ex.artion.artion.art.dto.ArtSearchResponseDto(" +
            "a.art_pk, a.art_name, a.painter, " +
            "COALESCE(top_followers.f_c, 0)) " +
            "FROM   " +
            "(SELECT ranked.art_pk as art_pk, ranked.f_c as f_c FROM (" +
            " SELECT COALESCE(COUNT(f.artEntity.art_pk), 0) as f_c, c.art_pk as art_pk, " +
            " ROW_NUMBER() OVER (ORDER BY COUNT(f.artEntity.art_pk) DESC) as rn " +
            " FROM ArtEntity c LEFT JOIN ArtFollowingEntity f " +
            " ON c.art_pk = f.artEntity.art_pk " +
            " GROUP BY c.art_pk " +
            ") as ranked " +
            " WHERE ranked.rn <= 10) as top_followers LEFT JOIN ArtEntity a " +
            "ON a.art_pk = top_followers.art_pk", nativeQuery = false)
    List<ArtSearchResponseDto> findAllWithFollowerCount();

    @Query(value = "SELECT new com.ex.artion.artion.art.dto.ArtSearchResponseDto(" +
            "a.art_pk, a.art_name, a.painter, " +
            "COALESCE(top_followers.f_c, 0)) " +
            "FROM   " +
            "(SELECT ranked.art_pk as art_pk, ranked.f_c as f_c FROM (" +
            " SELECT COALESCE(COUNT(f.artEntity.art_pk), 0) as f_c, c.art_pk as art_pk, " +
            " ROW_NUMBER() OVER (ORDER BY c.upload DESC) as rn " +
            " FROM ArtEntity c LEFT JOIN ArtFollowingEntity f " +
            " ON c.art_pk = f.artEntity.art_pk " +
            " GROUP BY c.art_pk " +
            ") as ranked " +
            " WHERE ranked.rn <= 10) as top_followers LEFT JOIN ArtEntity a " +
            "ON a.art_pk = top_followers.art_pk", nativeQuery = false)
    List<ArtSearchResponseDto> findAllWithRecent();

    // 카테고리, 키워드, max, min, sortby, sort, pagination 해야됨
    @Query(value = "SELECT new com.ex.artion.artion.art.dto.ArtSearchKeywordResponseDto(a.art_pk, COALESCE(c.price, a.minP), a.art_name, a.painter, COALESCE(d.f_c, 0), COALESCE(im.image,'') ), COALESCE(c.price, a.minP) as price , COALESCE(d.f_c, 0) as artFollowingNum " +
            "FROM ArtEntity a " +
            "LEFT JOIN (SELECT b.art_entity.art_pk AS art_pk, MAX(b.current_price) AS price " +
            "            FROM AuctionEntity b " +
            "            GROUP BY b.art_entity.art_pk) AS c ON a.art_pk = c.art_pk " +
            "LEFT JOIN (SELECT COUNT(*) AS f_c, f.artEntity.art_pk AS art_entity_art_pk " +
            "            FROM ArtFollowingEntity f " +
            "            GROUP BY f.artEntity.art_pk) AS d ON a.art_pk = d.art_entity_art_pk " +
            "LEFT JOIN (SELECT image.art_image_pk as art_pk, MAX(image.art_image_url) as image " +
            "           FROM ArtImageEntity as image " +
            "           GROUP BY art_pk) as im ON a.art_pk = im.art_pk " +
            "WHERE (:minPrice <= COALESCE(c.price, a.minP) and COALESCE(c.price, a.minP)<= :maxPrice) " +
            "AND (:keyword IS NULL OR :keyword = '' OR a.art_name LIKE %:keyword% OR a.art_info LIKE %:keyword%) " +
            "AND a.art_pk in (SELECT DISTINCT(k.art.art_pk) FROM ArtArtCategory as k WHERE (:category IS NULL OR :category = '' OR k.art_category.art_category_name = :category)) "

            )
    Page<ArtSearchKeywordResponseDto> findAllWithDetails(@Param("keyword") String keyword, @Param("category") String category, @Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice, Pageable pageable);
    @Query(value = "SELECT * FROM art_entity a " +
            "WHERE a.user_entity_user_pk = :user_pk "
            ,nativeQuery = true)
    List<ArtEntity> findAllByUser_pk(@Param("user_pk") Integer user_pk);

    @Query(value = "SELECT * FROM art_entity a " +
            "WHERE a.art_pk = :art_pk "
            ,nativeQuery = true)
    ArtEntity findByArt_pk(Integer art_pk);


    @Query(value = "SELECT * FROM art_entity as a " +
            "WHERE a.current_auction_status != 3 ",nativeQuery = true)
    List<ArtEntity> findAllByCurrentAuctionStatus();
}