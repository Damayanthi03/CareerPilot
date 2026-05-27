export type CareerDomainInfo = {
  id: string;
  name: string;
  description: string;
  keySkills: string[];
  avgSalaryRange: string;
};

export const CAREER_DOMAINS: CareerDomainInfo[] = [
  {
    id: "web_development",
    name: "Web Development",
    description: "Build and maintain websites and web applications using modern frontend and backend frameworks.",
    keySkills: ["HTML/CSS", "JavaScript", "React", "Node.js", "REST APIs", "Databases"],
    avgSalaryRange: "$65,000 – $130,000",
  },
  {
    id: "data_analytics",
    name: "Data Analytics",
    description: "Extract insights from large datasets to support business decisions using statistical methods and visualization tools.",
    keySkills: ["SQL", "Python", "Excel", "Tableau", "Statistics", "Data Visualization"],
    avgSalaryRange: "$60,000 – $120,000",
  },
  {
    id: "ai_ml",
    name: "AI / Machine Learning",
    description: "Design and build intelligent systems that learn from data to solve complex problems.",
    keySkills: ["Python", "TensorFlow", "PyTorch", "Statistics", "Linear Algebra", "Model Training"],
    avgSalaryRange: "$90,000 – $160,000",
  },
  {
    id: "cyber_security",
    name: "Cyber Security",
    description: "Protect systems, networks, and data from digital attacks and ensure organizational security posture.",
    keySkills: ["Networking", "Ethical Hacking", "Cryptography", "Linux", "Firewalls", "Risk Analysis"],
    avgSalaryRange: "$75,000 – $140,000",
  },
  {
    id: "cloud_computing",
    name: "Cloud Computing",
    description: "Architect, deploy, and manage scalable cloud infrastructure and services on platforms like AWS, Azure, and GCP.",
    keySkills: ["AWS/Azure/GCP", "DevOps", "Docker", "Kubernetes", "Terraform", "Networking"],
    avgSalaryRange: "$80,000 – $145,000",
  },
  {
    id: "app_development",
    name: "App Development",
    description: "Create native and cross-platform mobile applications for iOS and Android devices.",
    keySkills: ["Swift", "Kotlin", "React Native", "Flutter", "UI/UX Design", "App Store Deployment"],
    avgSalaryRange: "$70,000 – $135,000",
  },
  {
    id: "blockchain",
    name: "Blockchain Development",
    description: "Build decentralized applications, smart contracts, and distributed ledger systems on blockchain platforms.",
    keySkills: ["Solidity", "Web3.js", "Ethereum", "Smart Contracts", "DeFi", "Cryptography"],
    avgSalaryRange: "$85,000 – $155,000",
  },
  {
    id: "devops",
    name: "DevOps & Site Reliability",
    description: "Bridge development and operations to automate deployments, ensure uptime, and build resilient infrastructure pipelines.",
    keySkills: ["CI/CD", "Docker", "Kubernetes", "Ansible", "Monitoring", "Shell Scripting"],
    avgSalaryRange: "$80,000 – $150,000",
  },
  {
    id: "game_development",
    name: "Game Development",
    description: "Design and develop interactive games across PC, console, and mobile platforms using game engines and real-time rendering.",
    keySkills: ["Unity", "Unreal Engine", "C#", "C++", "3D Modeling", "Physics Simulation"],
    avgSalaryRange: "$60,000 – $125,000",
  },
  {
    id: "ui_ux_design",
    name: "UI/UX Design",
    description: "Design intuitive, accessible user interfaces and seamless user experiences for digital products.",
    keySkills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems", "Accessibility"],
    avgSalaryRange: "$65,000 – $130,000",
  },
  {
    id: "iot",
    name: "IoT & Embedded Systems",
    description: "Engineer connected hardware and software solutions for smart devices, sensors, and real-time embedded systems.",
    keySkills: ["C/C++", "Raspberry Pi", "Arduino", "MQTT", "Embedded Linux", "Circuit Design"],
    avgSalaryRange: "$70,000 – $130,000",
  },
  {
    id: "ar_vr",
    name: "AR/VR Development",
    description: "Create immersive augmented and virtual reality experiences for training, entertainment, and enterprise applications.",
    keySkills: ["Unity/Unreal", "ARKit/ARCore", "3D Assets", "Spatial Computing", "C#", "OpenXR"],
    avgSalaryRange: "$75,000 – $145,000",
  },
];
