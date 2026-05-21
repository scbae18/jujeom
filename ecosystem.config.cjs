module.exports = {
  apps: [{
    name: "festival",
    script: "server/index.js",
    env: {
      NODE_ENV: "production",
      PORT: "3002",
      STATE_FILE: "/home/ubuntu/data/state.json",
      ADMIN_SECRET: "",
    },
    restart_delay: 3000,
  }],
};
