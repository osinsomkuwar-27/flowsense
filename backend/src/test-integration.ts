import axios from "axios";

const API_URL = "http://localhost:4000";

async function runTests() {
  console.log("🚀 Starting FlowSense API & Auth Integration Tests...\n");

  try {
    // 1. Verify health endpoint
    console.log("🤖 1. Testing health status...");
    const health = await axios.get(`${API_URL}/health`);
    console.log("✅ Health response:", health.data);

    // 2. Register test user
    console.log("\n👤 2. Testing user registration...");
    const signupEmail = `dev-${Date.now()}@flowsense.io`;
    const signup = await axios.post(`${API_URL}/api/auth/signup`, {
      email: signupEmail,
      password: "devpassword123",
      fullName: "Lead Developer",
    });
    console.log("✅ Signup successful! JWT generated.");

    // 3. Login
    console.log("\n🔑 3. Testing user login...");
    const login = await axios.post(`${API_URL}/api/auth/login`, {
      email: signupEmail,
      password: "devpassword123",
    });
    const token = login.data.data.token;
    console.log("✅ Login successful! Token retrieved.");

    const headers = { Authorization: `Bearer ${token}` };

    // 4. Test integrations config retrieval
    console.log("\n🔌 4. Retrieving integrations...");
    const integrations = await axios.get(`${API_URL}/api/integrations`, { headers });
    console.log(`✅ Loaded ${integrations.data.data.length} integrations.`);

    // 5. Test manual poll trigger
    console.log("\n⚡ 5. Triggering manual integration poll...");
    const poll = await axios.post(`${API_URL}/api/integrations/poll/github`, {}, { headers });
    console.log("✅ Poll completed. Data:", poll.data.data);

    // 6. Test incoming webhooks (unauthenticated push notification)
    console.log("\n⚓ 6. Simulating incoming Git Push webhook notification...");
    const webhook = await axios.post(
      `${API_URL}/api/webhooks/github`,
      {
        after: "sha123456789",
        repository: { full_name: "flowsense/test-repo" },
        commits: [{ message: "fix: resolve memory leakage issues" }],
      },
      {
        headers: { "x-github-event": "push" },
      }
    );
    console.log("✅ Webhook response:", webhook.data);

    // 6.5 Submit dummy workflow for that ID
    console.log("\n📝 6.5 Submitting dummy workflow suggest for event...");
    await axios.post(`${API_URL}/api/workflow/submit`, {
      id: "gh-webhook-sha123456789",
      metric: "commit.count",
      severity: "low",
      source: "github",
      rootCause: "Webhook push trigger",
      businessImpact: "Low impact",
      factors: ["code.change"],
      urgency: "low",
      workflow: {
        title: "Verify push webhook",
        problem: "Simulated webhook trigger",
        actionPlan: ["Trigger static code analysis lint checks", "Deploy to development staging env"],
      },
      svg: "<svg>dummy</svg>",
    });
    console.log("✅ Workflow submitted successfully.");

    // 7. Test workflow execution endpoint
    console.log("\n🎯 7. Simulating workflow action execution...");
    const execute = await axios.post(`${API_URL}/api/workflow/gh-webhook-sha123456789/execute`, {}, { headers });
    console.log("✅ Execution response:", execute.data);

    console.log("\n🎉 All integration tests passed successfully!");
  } catch (err: any) {
    console.error("❌ Test failed:", err.response?.data || err.message);
  }
}

runTests();
