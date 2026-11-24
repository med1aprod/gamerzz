window.NEXUS_CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbzdeoLqQk0tN4NJGU7rt2K-l4B_BenJitbyZ8y1xc2iAS-ILC92PXNq5M_huApNUU21DA/exec",
  discordInvite: "https://discord.gg/gRdeVkG5vf",
  alarmUrl: "https://alarm.nexusroleplay.ru",
  groqModel: "qwen/qwen3.8-27b",
  _k: ["KRYTKjdmJxpeXiwYb19hBlF9N", "SNSIQMpLzIXKzIeKHclOGJjBk", "NSGxUlMhwJKjobKWIYZxtYOSw="]
};
(function () {
  try {
    var p = "NexusRP-n.ai-2026-play";
    var b = atob(window.NEXUS_CONFIG._k.join(""));
    var out = "";
    for (var i = 0; i < b.length; i++) out += String.fromCharCode(b.charCodeAt(i) ^ p.charCodeAt(i % p.length));
    window.NEXUS_CONFIG.groqKey = out;
  } catch (e) {
    window.NEXUS_CONFIG.groqKey = "";
  }
})();
