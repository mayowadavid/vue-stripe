<template>
  <div>
    <v-btn v-if="display == false" @click.prevent="handlePop" dark color="blue" >Checkout</v-btn>
    <div v-show="display">
        <Checkout/>
    </div>
  </div>
</template>

<script>
import Checkout from '../components/Checkout.vue';

export default {
  name: 'Order',
  data(){
      return {
        display: false
      }
  },
  components: {
    Checkout,
  },
  methods: {
    handlePop(){
      this.display = true
    }
  }
};
</script>
