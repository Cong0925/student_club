<template>
<div class="clubMain">
  
  <div class="clubMain_header">
    <div class="clubMain_One"><MemberStyle/></div>
    <div class="clubMain_Two"><ClubRecommendActivity/></div>
  </div>

  <div class="clubMain_Main">
    <div class="clubMain-left"><ClubRecommendNews/></div>
    <div class="clubMain-right"><ClubRecomendNotice/></div>
  </div>
  <div class="clubMain_Footer">
    <MemberAppearance/>
  </div>
</div>
</template>

<script>
import RotationPic from '@/components/RotationPic'
import MemberStyle from '@/views/clubMain/components/memberStyle'
import ClubRecommendNews from '@/views/clubMain/components/clubRecommendNews'
import ClubRecomendNotice from '@/views/clubMain/components/clubRecomendNotice'
import ClubRecommendActivity from '@/views/clubMain/components/clubRecommendActivity'
import MemberAppearance from '@/views/clubMain/components/memberAppearance'
export default {
  name: 'clubMain',
  components: {
    RotationPic,
    MemberStyle,
    ClubRecommendNews,
    ClubRecomendNotice,
    ClubRecommendActivity,
    MemberAppearance
  }
}
</script>

<style scoped>
.clubMain{
    width:1250px; 
    margin: auto;
}
.clubMain_header{
  height: 290px;
}
.clubMain_One{
  width: 34%;
  margin-right: 1%;
  float: left;
}
.clubMain_Two{
  width: 65%;
  float: left;
  padding-top: 20px;
}
.clubMain_Main{
  height: 470px;
  margin-top: 10px;
}
.clubMain-left{
    width: 59%;
    height: 100%;
    float: left;
}
.clubMain-right{
    width: 40%;
    margin-left: 1%;
    float: left;
}
.clubMain_Footer{
  height: 220px;
}
</style>