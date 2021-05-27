<template>
  <div id="app">
    <Header></Header>

    <Navigation></Navigation>

    <router-view></router-view>

    <!--<Footer></Footer>-->
  </div>
</template>

<script>
import Header from "./components/Header";
//import PageFooter from "@/Components/PageFooter";
import Navigation from "./components/Navigation";
  export default {
  name: 'app',
    components: {
      //PageFooter,
      Header,
      Navigation,
    },
  data () {
    return {
    }
  }
}
</script>