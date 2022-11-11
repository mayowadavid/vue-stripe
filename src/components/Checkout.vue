<template>
     <div class="payment">
                    <form>
                            <p>
                                <label>Email</label>
                                <input type="text" v-model="email"  name="email" placeholder="Your name..">
                            </p>
                                <label>Card Information</label>
                                <div class="card-wrapper">
                                    <div class="card-number">
                                         <input type="number" v-model="card.number" :class="['is-danger' ? cardNumberError : '', 'input']" name="cardNumber"  placeholder="1234 1234 1234 1234">
                                         <span class="help is-danger" v-show="cardNumberError">
                                              {{ cardNumberError }}
                                         </span>
                                    </div>
                                    <div class="card-info">
                                        <input type="number" v-model="card.exp_month"  name="expiry"  placeholder="MM">
                                         <input type="number" v-model="card.exp_year"  name="expiry"  placeholder="YY">
                                        <input type="number" v-model="card.cvc"  name="cvc"  placeholder="CVC">
                                        <span class="help is-danger" v-show="cardMonthError">
                                            {{ cardMonthError }}
                                        </span>
                                        <span class="help is-danger" v-show="cardYearError">
                                            {{ cardYearError }}
                                        </span>
                                    </div>
                                    <div class="help is-danger" v-if="cardCheckError">
                                          <span>{{ cardCheckErrorMessage }}</span>
                                    </div>
                                </div>
                            <p>
                            <label htmlFor="senderFirstName">Name on Card</label>
                            <input type="text" v-model="name"  name="cardName" >
                            </p>
                            <div class="submit">
                                <v-btn @click.prevent="validate" :disabled="cardCheckSending" :loading=true dark color="blue" >Submit</v-btn>
                            </div>
                    </form>
            </div> 
</template>

<script>
import axios from 'axios';

export default {
    name: 'Checkout',
    data(){
        return {
            stripeKey: 'pk_test_VoEGSZ5In2KjLls3QZhzq8oj007eLubU37',

            // fields
            name: 'bran',
            email: 'bran@gmail.com',
            specialNote: 'This is a demo text',
            card: {
                number: '4242424242424242',
                cvc: '123',
                exp_month: '01',
                exp_year: '19'
            },

            // validation
            cardNumberError: null,
            cardCvcError: null,
            cardMonthError: null,
            cardYearError: null,
            cardCheckSending: false,
            cardCheckError: false,
            cardCheckErrorMessage: '',
            //loading
            loading: false
        }
    },
    mounted() {
      let Stripe = document.createElement('script')
      Stripe.setAttribute('src', 'https://js.stripe.com/v2/')
      document.head.appendChild(Stripe);
      let jquery = document.createElement('script')
      jquery.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js')
      document.head.appendChild(jquery);
    },
    methods: {
        validate(){
            this.clearCardErrors();
            let valid = true;
            if(!this.card.number){ valid = false; this.cardNumberError = "Card Number is Required"; }
            if(!this.card.cvc){ valid = false; this.cardCvcError = "CVC is Required"; }
            if(!this.card.exp_month){ valid = false; this.cardMonthError = "Month is Required"; }
            if(!this.card.exp_year){ valid = false; this.cardYearError = "Year is Required"; }
            if(valid){
                this.createToken();
            }
        },
        clearCardErrors(){
            this.cardNumberError = null;
            this.cardCvcError = null;
            this.cardMonthError = null;
            this.cardYearError = null;
        },
        createToken() {
            this.cardCheckError = false;
            window.Stripe.setPublishableKey(this.stripeKey);
            window.Stripe.createToken(this.card, $.proxy(this.stripeResponseHandler, this));
            this.cardCheckSending = true;
        },
        stripeResponseHandler(status, response) {
            this.cardCheckSending = false;
            if (response.error) {
                this.cardCheckErrorMessage = response.error.message;
                this.cardCheckError = true;
                console.error(response.error);
            } else {
                // token to create a charge on our server 
                var token_from_stripe = response.id;
                var request = {
                    name: this.name,
                    email: this.email,
                    card: this.card,
                    token_from_stripe: token_from_stripe
                };
                // Send to our server
                axios.post("https://stripe-upfunk.herokuapp.com/upFunk-pay", request)
                    .then((res) => {
                        console.log(res.data);
                        var error = res.data.error;
                        var charge = res.data.charge;
                        if (error){
                            console.error(error);
                        }
                    });
            }
        }
    }
}
</script>

<style>
.payment {
  align-items: center;
  height: 100vw;
  height: 100vh;
  display: flex;
  height: 100vh;
  z-index: 10000;
  background-color: rgba(255, 255, 255, 0.774);
}

.payment > form {
  margin: 0 auto;
  width: 500px;
  align-items: center;
  padding: 4vw;
  background-color: rgba(255, 255, 255, 0.774);
  border-radius: 1vw;
  box-shadow: 1px 2px 5px rgb(0 0 0 / 15%);
}

.is-danger {
  color: red;
  font-size: small;
}

.payment label {
  font-weight: bold;
}

.card-wrapper {
  display: block;
  width: 100%;
}

.card-number {
  width: 100%;
  display: block;
  margin-bottom: 0;
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

.card-number input[type=number] {
  margin-bottom: 0;
  border-radius: 4px 4px 0 0;
  border: 1px solid #ccc;
  padding: 12px 20px;
  width: 100%;
  box-sizing: border-box;
  -webkit-appearance: none;
}

.card-info {
  margin-top: 0;
  width: 100%;
  display: flex;
}

.card-info input[type=number] {
  margin-bottom: 0;
  border-radius: 4px 4px 0 0;
  border: 1px solid #ccc;
  padding: 12px 20px;
  width: 100%;
  box-sizing: border-box;
  -webkit-appearance: none;
}

.card-info input[type=text] {
  margin-top: 0;
}

.card-info input[type=number]:first-child {
  border-radius: 0 0 0 4px;
}

.card-info input[type=number]:last-child {
  border-radius: 0 0 4px 0;
}

input[type=text]{
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

input[type=submit] {
    background-color: #213569;
    color: white;
    padding: 1vh 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 30%;
  }
</style>