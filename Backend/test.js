const axios = require('axios');

async function test() {
    try {
        // First login
        const loginRes = await axios.post('http://localhost:5000/api/v1/sign-in', {
            username: "sambhab Dutta", // from logs earlier
            password: "testpassword" // whatever password we don't know it, wait
        });
    } catch(e) {
        console.log(e);
    }
}
test();
