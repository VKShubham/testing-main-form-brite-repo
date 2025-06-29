// // api/proxy.js

// export default async function handler(req, res) {
//   // Log method and headers for debugging
//   console.log("Incoming request:", req.method, req.headers);

//   // Handle CORS preflight requests
//   if (req.method === "OPTIONS") {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     res.status(200).end();
//     return;
//   }

//   // Manually read the request body
//   let rawBody = "";
//   try {
//     rawBody = await new Promise((resolve, reject) => {
//       let data = "";
//       req.on("data", (chunk) => {
//         data += chunk;  
//       });
//       req.on("end", () => resolve(data));
//       req.on("error", (err) => reject(err));
//     });
//     console.log("Raw body:", rawBody);
//   } catch (err) {
//     console.error("Error reading request body:", err);
//     res.status(400).json({ error: "Error reading request body" });
//     return;
//   }

//   let parsedBody;
//   try {
//     parsedBody = JSON.parse(rawBody);
//     console.log("Parsed body:", parsedBody);
//   } catch (err) {
//     console.error("Invalid JSON:", err);
//     res.status(400).json({ error: "Invalid JSON" });
//     return;
//   }

//   const deployedUrl =
//     "https://script.google.com/macros/s/AKfycbw3ko7s0ev_8dF4KfU1X5XBa48YZQ1t6DHphbfky6CFPqXaM6H9Cqo6gI_gEQW8xbtS/exec";

//   try {
//     console.log("Forwarding request to Apps Script endpoint:", deployedUrl);
//     const response = await fetch(deployedUrl, {
//       method: "POST",
//       body: JSON.stringify(parsedBody),
//     });

//     const textData = await response.text();
//     console.log("Response from Apps Script:", textData);

//     // Add the CORS header and return the response from Apps Script
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.status(response.status).send(textData);
//   } catch (error) {
//     console.error("Error forwarding request:", error);
//     res.status(500).json({ error: error.message });
//   }
// }
  