package com.ex.artion.artion.art.respository;

import com.ex.artion.artion.art.dto.ArtSearchKeywordResponseDto;
import com.ex.artion.artion.art.dto.ArtSearchResponseDto;
import com.ex.artion.artion.art.entity.ArtEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
    @Query(value = "SELECT new com.ex.artion.artion.art.dto.ArtSearchKeywordResponseDto(a.art_pk, COALESCE(c.price, a.minP), a.art_name, a.painter, COALESCE(d.f_c, 0)) " +
            "FROM ArtEntity a " +
            "LEFT JOIN (SELECT b.art_entity.art_pk AS art_pk, MAX(b.current_price) AS price " +
            "            FROM AuctionEntity b " +
            "            GROUP BY b.art_entity.art_pk) AS c ON a.art_pk = c.art_pk " +
            "LEFT JOIN (SELECT COUNT(*) AS f_c, f.artEntity.art_pk AS art_entity_art_pk " +
            "            FROM ArtFollowingEntity f " +
            "            GROUP BY f.artEntity.art_pk) AS d ON a.art_pk = d.art_entity_art_pk ")
    List<ArtSearchKeywordResponseDto> findAllWithDetails();



}
