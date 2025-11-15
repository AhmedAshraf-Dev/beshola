/**
 * generate_and_register.js
 *
 * 1. Generates random phone numbers
 * 2. Calls FastVerifyUser for each
 * 3. Saves results to users.csv (phone, verificationID, status, message)
 *
 * Run:
 *   node generate_and_register.js
 */

const fs = require("fs");
const axios = require("axios");

// -------- CONFIG --------
const TOTAL_USERS = 1000; // how many users to create
const CONCURRENCY = 100; // max parallel requests
const OUTPUT_FILE = "users.csv";

const FAST_VERIFY_URL =
  "https://ihs-solutions.com:8000/BrandingMartSecurity/api/User/FastVerifyUser";
// ------------------------

function randomPhone() {
  // Generate Egyptian-like 11-digit phone numbers
  const prefix = "06";
  const second = Math.floor(30 + Math.random() * 70); // 30–99
  const suffix = Math.floor(100000000 + Math.random() * 899999999); // 9 digits
  return `${prefix}${second}${suffix}`.slice(0, 11);
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Simple concurrency pool
async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  const executing = new Set();
  for (const item of items) {
    const p = Promise.resolve().then(() => mapper(item));
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean).catch(clean);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

async function doFastVerify(phone) {
  const payload = {
    phoneNumber: phone,
    password: "123456",
    firstName: "Ashraf",
    lastName: "Shmrdn",
    birthdate: "2011-09-13T22:00:00.000Z",
    gender: "0",
  };

  try {
    const res = await axios.post(FAST_VERIFY_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
    });

    let verificationID = null;
    if (res.data) {
      verificationID =
        res.data.verificationID ||
        res.data?.data?.verificationID ||
        res.data?.result?.verificationID ||
        null;
    }

    return {
      phone,
      verificationID: verificationID || "",
      status: res.status,
      message: JSON.stringify(res.data).slice(0, 200),
    };
  } catch (err) {
    let msg = err.message;
    if (err.response && err.response.data) {
      msg = JSON.stringify(err.response.data).slice(0, 200);
    }
    return {
      phone,
      verificationID: "",
      status: err.response ? err.response.status : "ERR",
      message: msg,
    };
  }
}

(async () => {
  console.log(
    `Generating ${TOTAL_USERS} phones and calling FastVerifyUser (concurrency ${CONCURRENCY})...`
  );

  if (fs.existsSync(OUTPUT_FILE)) fs.unlinkSync(OUTPUT_FILE);
  fs.writeFileSync(
    OUTPUT_FILE,
    "phone,verificationID,status,message\n",
    "utf8"
  );

  const phones = new Set();
  while (phones.size < TOTAL_USERS) phones.add(randomPhone());
  const phoneList = [...phones];

  let i = 0;
  await mapWithConcurrency(phoneList, CONCURRENCY, async (phone) => {
    i++;
    process.stdout.write(`\r[${i}/${TOTAL_USERS}] ${phone}`.padEnd(60));
    const result = await doFastVerify(phone);

    const sanitizedMsg = result.message
      .replace(/"/g, '""')
      .replace(/\r?\n/g, " ");
    const line = `${result.phone},${result.verificationID},${result.status},"${sanitizedMsg}"\n`;
    fs.appendFileSync(OUTPUT_FILE, line, "utf8");

    await delay(Math.random() * 50);
    return result;
  });

  console.log(`\nDone. Saved to ${OUTPUT_FILE}`);
})();
