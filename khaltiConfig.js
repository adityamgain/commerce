
export const config = {
    // replace the publicKey with yours
    "publicKey": "test_public_key_da5c0932208b4b9285bcec5c51fde5ed",
    "productIdentity": "122",
    "productName": "coffee",
    "productUrl": "http://localhost:3000",
    "paymentPreference": [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        ],
    "eventHandler": {
        onSuccess (payload) {
            // hit merchant api for initiating verfication
            console.log(payload);
        },
        onError (error) {
            console.log(error);
        },
        onClose () {
            console.log('widget is closing');
        }
    }
};

