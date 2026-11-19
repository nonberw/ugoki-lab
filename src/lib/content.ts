// All visible copy and data for the site lives here, so text changes never touch layout code.

export const SITE = {
  name: "Ugoki Lab",
  short: "ugoki lab",
  kanji: "動き",
  seal: "動",
  url: "https://ugoki-lab.vercel.app",
  // Where "Join the lab" sends people. Leave empty until the lab has a public email,
  // e.g. "mailto:hello@your-domain". While empty, the Join section says contact is coming soon.
  contact: "",
};

export const NAV = [
  { label: "About", href: "#about" },
  { label: "Model", href: "#model" },
  { label: "Research", href: "#research" },
  { label: "Roadmap", href: "#roadmap" },
];

// figlet "Roman", generated once with the figlet package (see scripts/wordmark.mjs).
export const WORDMARK_WIDE = [
  "                                 oooo         o8o       oooo             .o8       ",
  "                                 `888         `\"'       `888            \"888       ",
  "oooo  oooo   .oooooooo  .ooooo.   888  oooo  oooo        888   .oooo.    888oooo.  ",
  "`888  `888  888' `88b  d88' `88b  888 .8P'   `888        888  `P  )88b   d88' `88b ",
  " 888   888  888   888  888   888  888888.     888        888   .oP\"888   888   888 ",
  " 888   888  `88bod8P'  888   888  888 `88b.   888        888  d8(  888   888   888 ",
  " `V88V\"V8P' `8oooooo.  `Y8bod8P' o888o o888o o888o      o888o `Y888\"\"8o  `Y8bod8P' ",
  "            d\"     YD                                                              ",
  "            \"Y88888P'                                                              ",
];

// Hero playground. Illustrative only: the open model is in training, and the card says so.
export const DEMOS = [
  {
    key: "Rover",
    prompt: "A small rover that maps my room and comes back to charge.",
    lines: [
      "plan    device graph: 14 parts, 22 links",
      "parts   ESP32-S3, 2 gear motors, motor driver, lidar, 2S battery",
      "wire    lidar on I2C, motors on two PWM pins, battery sense on ADC",
      "code    firmware for driving, mapping and docking",
      "check   motor stall current is under the driver limit: ok",
      "build   parts list, cost and a 9-step assembly guide",
    ],
  },
  {
    key: "Robot arm",
    prompt: "A 4-axis desk arm that sorts small parts by color.",
    lines: [
      "plan    device graph: 11 parts, 18 links",
      "parts   4 servos, camera, microcontroller, 5 V supply",
      "wire    servos on a PWM board, camera on USB",
      "code    inverse kinematics and a color sorter",
      "check   holding torque at full reach: ok",
      "build   printable links, parts list, wiring sheet",
    ],
  },
  {
    key: "Plant care",
    prompt: "A sensor that waters my plants and tells me when it did.",
    lines: [
      "plan    device graph: 7 parts, 9 links",
      "parts   microcontroller, soil probe, pump, relay, water level switch",
      "wire    probe on ADC, pump through the relay",
      "code    watering schedule and phone notifications",
      "check   pump never runs on an empty tank: ok",
      "build   enclosure, parts list, 6-step guide",
    ],
  },
];

export const PROBLEMS = [
  {
    n: "一",
    title: "Models stay closed",
    body: "The strongest robot foundation models live behind company walls. Researchers can’t inspect, retrain or fix them.",
  },
  {
    n: "二",
    title: "Hardware is out of reach",
    body: "Humanoid platforms are priced for factories, not classrooms. Real-robot research stays with a few well-funded teams.",
  },
  {
    n: "三",
    title: "Engineering is slow",
    body: "Turning an idea into a working device still takes weeks of CAD, wiring, firmware and debugging, all by hand.",
  },
];

export const BUILD = {
  humanoids: {
    title: "Affordable humanoids",
    body: "Open humanoid designs a school or small lab can build, repair and improve. Standard parts, printed structure, an open bill of materials.",
    image: "/media/h_tsukuba.jpg",
    alt: "Two research humanoid robots on display stands",
    credit: "Reference photo: Syced, CC0",
  },
  model: {
    title: "An open engineering model",
    body: "An LLM for physical AI that turns a description into a real project: CAD, wiring, firmware and parts.",
  },
  sim: {
    title: "Sim-to-real research",
    body: "Simulation, learning and control that run on cheap machines, then move to real robots.",
  },
  impact: {
    title: "Problems that matter",
    body: "We pick projects by their impact on people’s lives, not by revenue. Then we publish everything.",
    image: "/media/h_dasa.jpg",
    alt: "Close-up of a humanoid robot head and torso",
    credit: "Reference photo: Sven Volkens, CC BY-SA 4.0",
  },
};

export const PIPELINE = [
  { verb: "Describe", body: "Say what the device should do, in plain words." },
  { verb: "Plan", body: "One device graph: parts, links, constraints." },
  { verb: "Generate", body: "CAD, wiring and firmware from that graph." },
  { verb: "Verify", body: "Physics and electrical checks before anything is built." },
  { verb: "Build", body: "Parts list, assembly guide and cost." },
];

export const RESEARCH = [
  {
    name: "SUSS",
    question: "What does a transformer learn when it adapts to unknown physics in context?",
    status: "Pre-registered, released",
  },
  {
    name: "LISTEN",
    question: "When do robot policies learn to follow their instructions instead of the scene?",
    status: "Pre-registered, released",
  },
  {
    name: "VIBES",
    question: "When a video world model fails on new physics, is it inference, execution or perception?",
    status: "Pre-registered, in progress",
  },
];

export const OPEN = ["MIT license", "open weights", "open datasets", "open hardware", "公開"];

export const STATS = [
  { value: 2, suffix: " yrs", label: "Defense technology", body: "Hardware and software built to a reliability bar." },
  { value: 3, suffix: "+ yrs", label: "Machine learning", body: "Training, evaluating and shipping models." },
  { value: 3, suffix: "", label: "Servers in the lab", body: "For robot hardware, model training and simulation." },
  { value: 3, suffix: "", label: "Pre-registered studies", body: "Hypotheses written down before the first result." },
];

export const FACTS = [
  { big: "GovTech", label: "State digitization in Kazakhstan, at a state company with real users." },
  { big: "Caltech, Berkeley", label: "Research work with Caltech and UC Berkeley." },
];

export const ROADMAP = [
  {
    when: "Months 0-6",
    title: "Open sim-to-real stack",
    body: "First arm and legged platforms on real hardware. Code and results released every month.",
  },
  {
    when: "Months 6-12",
    title: "Humanoid v0 and model v0",
    body: "First low-cost humanoid on the bench. The open model designs simple devices end to end.",
  },
  {
    when: "Months 12-24",
    title: "Open kits for everyone",
    body: "Humanoid kits and the open model in use by schools and labs around the world.",
  },
];

export const ROLES = [
  "Researchers and engineers",
  "Hardware and compute partners",
  "Grants and sponsors",
  "Universities and schools",
];
