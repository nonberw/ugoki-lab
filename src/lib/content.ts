// All visible copy and data for the site lives here, so text changes never touch layout code.

export const SITE = {
  name: "Ugoki Lab",
  short: "ugoki lab",
  kanji: "動き",
  seal: "動",
  meaning: "ugoki means “movement” in Japanese",
  url: "https://ugoki-lab.vercel.app",
  repo: "https://github.com/nonberw/ugoki-lab",
  github: "https://github.com/nonberw",
  // Where "Join the lab" points. Swap for a mailto: link once the lab has an email.
  contact: "https://github.com/nonberw/ugoki-lab/issues/new?title=I%20want%20to%20join%20Ugoki%20Lab&body=Who%20I%20am%20and%20how%20I%20can%20help%3A%0A",
};

export const NAV = [
  { label: "Work", href: "#work" },
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

export const BUILD = [
  {
    title: "Affordable humanoids",
    body: "Open humanoid designs a school or small lab can build, repair and improve.",
    image: "/media/h_tsukuba.jpg",
    alt: "Two research humanoid robots on display stands",
    credit: "Photo: Syced, CC0",
  },
  {
    title: "An open engineering model",
    body: "An LLM for physical AI that turns a description into a real project: CAD, wiring, firmware, parts.",
    image: "/media/proto-arm.png",
    alt: "Render of a generated robot arm project with its electronics",
  },
  {
    title: "Sim-to-real research",
    body: "Simulation, learning and control that run on cheap machines, then move to real robots.",
    clip: "/media/yard",
    alt: "Simulated yard with ten legged robots and scattered objects",
  },
  {
    title: "Problems that matter",
    body: "We pick projects by their impact on people’s lives, not by revenue. Then we publish everything.",
    image: "/media/h_dasa.jpg",
    alt: "Close-up of a humanoid robot head and torso",
    credit: "Photo: Sven Volkens, CC BY-SA 4.0",
  },
];

export const PROJECTS = [
  {
    name: "ARMageddon",
    what: "6-DoF inverse kinematics from scratch",
    metric: "99.6% success on 500 random poses, about 0.7 ms per solve",
    clip: "/media/arm",
    href: "https://github.com/nonberw/armageddon",
  },
  {
    name: "ZOOMIES",
    what: "Quadruped and PPO written from scratch",
    metric: "Survives a 1.5 m/s kick 93% of the time",
    clip: "/media/zoomies",
    href: "https://github.com/nonberw/zoomies",
  },
  {
    name: "COPYCAT",
    what: "Imitation learning for a robot arm",
    metric: "Places the cube 98% of the time on unseen layouts",
    clip: "/media/copycat",
    href: "https://github.com/nonberw/copycat",
  },
  {
    name: "YOINK",
    what: "Vision and grasping with no machine learning",
    metric: "810 of 810 cubes sorted, 0.2 mm position error",
    clip: "/media/yoink",
    href: "https://github.com/nonberw/yoink",
  },
  {
    name: "SPUD",
    what: "Robot simulation for weak laptops",
    metric: "65,536 robots walking at once on a laptop CPU",
    clip: "/media/world",
    href: "https://github.com/nonberw/spud",
  },
];

export const PIPELINE = [
  { verb: "Describe", body: "“A rover that maps my room”" },
  { verb: "Plan", body: "One device graph: parts, links, constraints" },
  { verb: "Generate", body: "CAD, wiring and firmware from that graph" },
  { verb: "Verify", body: "Physics and electrical checks before building" },
  { verb: "Build", body: "Parts list, assembly guide and cost" },
];

export const RESEARCH = [
  {
    name: "SUSS",
    question: "What does a transformer learn when it adapts to unknown physics in context?",
    status: "Pre-registered, paper and models released",
    href: "https://nonberw.github.io/suss",
  },
  {
    name: "LISTEN",
    question: "When do robot policies learn to follow their instructions instead of the scene?",
    status: "Pre-registered, paper released",
    href: "https://nonberw.github.io/listen",
  },
  {
    name: "VIBES",
    question: "When a video world model fails on new physics, is it inference, execution or perception?",
    status: "Pre-registered, in progress",
  },
];

export const OPEN = ["MIT license", "open weights", "open datasets", "open hardware", "公開"];

export const TEAM = [
  { big: "2 yrs", label: "Defense technology", body: "Hardware and software built to a reliability bar." },
  { big: "GovTech", label: "State digitization, Kazakhstan", body: "Large systems with real users at a state company." },
  { big: "3+ yrs", label: "Machine learning", body: "Training, evaluating and shipping models." },
  { big: "Caltech, Berkeley", label: "Research experience", body: "Research work with Caltech and UC Berkeley." },
  { big: "3", label: "Servers in the lab", body: "For robot hardware, model training and simulation." },
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
