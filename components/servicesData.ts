export type Stop = {
  id: string;
  title: string;
  short: string;
  desc: string;
  includes: string[];
  lat: number;
  lon: number;
  size: number;
};

export const STOPS: Stop[] = [
  { id: "brand", title: "Brand Presence Systems", short: "Brand Presence", desc: "Modern websites, branding, and digital identity systems.", includes: ["Brand identity and guidelines", "Website design and build", "Messaging and voice"], lat: 14, lon: 0, size: 0.075 },
  { id: "content", title: "Content Systems", short: "Content", desc: "Strategic content ecosystems and social media infrastructure.", includes: ["Content strategy and calendar", "Photo and video libraries built for reuse", "Social media systems"], lat: -22, lon: 62, size: 0.06 },
  { id: "funnels", title: "Funnels & Lead Systems", short: "Funnels & Leads", desc: "Lead generation systems and conversion infrastructure.", includes: ["Landing pages and funnels", "Booking and contact flows", "Tracking and reporting"], lat: 28, lon: 125, size: 0.07 },
  { id: "cinematic", title: "Cinematic Campaigns", short: "Cinematic", desc: "Story-driven visual campaigns that elevate brand perception.", includes: ["Brand films and commercials", "Photography and art direction", "Launch assets"], lat: -12, lon: 188, size: 0.085 },
  { id: "ai", title: "AI-Assisted Creative Systems", short: "AI-Assisted", desc: "Modern workflows that accelerate execution while maintaining originality and emotional impact.", includes: ["Production workflows", "AI-assisted editing and design", "Creative direction on every output"], lat: 20, lon: 251, size: 0.065 },
  { id: "executive", title: "Executive Systems", short: "Executive", desc: "Client dashboards, reporting, and operational support built for leadership visibility.", includes: ["Client portal (Linc OS)", "Reporting and dashboards", "Operational support"], lat: -26, lon: 314, size: 0.07 },
];
