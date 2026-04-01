require('dotenv').config();
const mongoose = require('mongoose');
const Community = require('./models/Community');
const Hackathon = require('./models/Hackathon');

const communities = [
  {
    name: 'Web Development',
    domain: 'Web Development',
    description: 'Master modern web from HTML & CSS to React, Node.js, and full-stack architecture.',
    icon: '🌐',
    color: '#3b82f6',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    pathway: [
      { week: 1, title: 'HTML & CSS Fundamentals', description: 'Structure and style your first webpages.' },
      { week: 2, title: 'JavaScript Essentials', description: 'Variables, functions, DOM manipulation.' },
      { week: 3, title: 'React Basics', description: 'Components, props, state, hooks.' },
      { week: 4, title: 'Backend with Node.js', description: 'Express, REST APIs, MongoDB.' }
    ]
  },
  {
    name: 'AI & Machine Learning',
    domain: 'AI & Machine Learning',
    description: 'Dive into neural networks, NLP, computer vision, and build AI-powered applications.',
    icon: '🤖',
    color: '#8b5cf6',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'LLMs'],
    pathway: [
      { week: 1, title: 'Python for Data Science', description: 'NumPy, Pandas, Matplotlib.' },
      { week: 2, title: 'Machine Learning Basics', description: 'Supervised & unsupervised learning.' },
      { week: 3, title: 'Deep Learning', description: 'Neural networks with TensorFlow/Keras.' },
      { week: 4, title: 'Real-world AI Projects', description: 'Build and deploy ML models.' }
    ]
  },
  {
    name: 'Cybersecurity',
    domain: 'Cybersecurity',
    description: 'Ethical hacking, network security, cryptography, and CTF challenges.',
    icon: '🔐',
    color: '#ef4444',
    tags: ['Ethical Hacking', 'Networking', 'CTF', 'Linux', 'Cryptography', 'Penetration Testing'],
    pathway: [
      { week: 1, title: 'Networking Fundamentals', description: 'TCP/IP, DNS, HTTP protocols.' },
      { week: 2, title: 'Linux & Command Line', description: 'Bash scripting and system administration.' },
      { week: 3, title: 'Ethical Hacking Basics', description: 'Scanning, enumeration, exploitation.' },
      { week: 4, title: 'CTF Challenges', description: 'Practical security competitions.' }
    ]
  },
  {
    name: 'Cloud & DevOps',
    domain: 'Cloud & DevOps',
    description: 'AWS, Docker, Kubernetes, CI/CD pipelines, and infrastructure as code.',
    icon: '☁️',
    color: '#f59e0b',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
    pathway: [
      { week: 1, title: 'Cloud Basics & AWS', description: 'EC2, S3, IAM fundamentals.' },
      { week: 2, title: 'Docker & Containers', description: 'Containerize and deploy applications.' },
      { week: 3, title: 'Kubernetes Orchestration', description: 'Deploy at scale.' },
      { week: 4, title: 'CI/CD Pipelines', description: 'GitHub Actions, Jenkins, automation.' }
    ]
  },
  {
    name: 'UI/UX Design',
    domain: 'UI/UX Design',
    description: 'User research, wireframing, Figma prototyping, and design systems.',
    icon: '🎨',
    color: '#ec4899',
    tags: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    pathway: [
      { week: 1, title: 'Design Principles', description: 'Color theory, typography, layout.' },
      { week: 2, title: 'User Research', description: 'Interviews, personas, user journeys.' },
      { week: 3, title: 'Figma Mastery', description: 'Components, auto-layout, prototypes.' },
      { week: 4, title: 'Case Study Project', description: 'End-to-end product design.' }
    ]
  },
  {
    name: 'Data Science',
    domain: 'Data Science',
    description: 'Data wrangling, visualization, statistical analysis, and storytelling with data.',
    icon: '📊',
    color: '#10b981',
    tags: ['Python', 'SQL', 'Tableau', 'Statistics', 'Pandas', 'Visualization'],
    pathway: [
      { week: 1, title: 'Data Wrangling', description: 'Clean and transform messy datasets.' },
      { week: 2, title: 'SQL & Databases', description: 'Query real databases confidently.' },
      { week: 3, title: 'Data Visualization', description: 'Charts, dashboards, storytelling.' },
      { week: 4, title: 'Analytics Project', description: 'Analyze a real-world dataset.' }
    ]
  },
  {
    name: 'Android Development',
    domain: 'Android Development',
    description: 'Build native Android apps with Kotlin, Jetpack Compose, and Firebase.',
    icon: '📱',
    color: '#22c55e',
    tags: ['Kotlin', 'Android', 'Jetpack Compose', 'Firebase', 'Material Design'],
    pathway: [
      { week: 1, title: 'Kotlin Basics', description: 'Kotlin syntax and Android setup.' },
      { week: 2, title: 'UI with Jetpack Compose', description: 'Declarative UI components.' },
      { week: 3, title: 'Firebase Integration', description: 'Auth, Firestore, Storage.' },
      { week: 4, title: 'Publish to Play Store', description: 'Release your first app.' }
    ]
  },
  {
    name: 'Blockchain & Web3',
    domain: 'Blockchain',
    description: 'Ethereum, Solidity smart contracts, DeFi protocols, and NFT development.',
    icon: '⛓️',
    color: '#6366f1',
    tags: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'DeFi', 'NFT'],
    pathway: [
      { week: 1, title: 'Blockchain Fundamentals', description: 'How blockchains work.' },
      { week: 2, title: 'Solidity Smart Contracts', description: 'Write your first contract.' },
      { week: 3, title: 'DApp Development', description: 'Connect frontend to blockchain.' },
      { week: 4, title: 'DeFi & NFT Project', description: 'Build a real Web3 project.' }
    ]
  }
];

const hackathons = [
  {
    title: 'Smart City Nashik Hackathon 2026',
    description: 'Build tech solutions for local civic problems — traffic, waste management, water conservation. Impact real lives in Nashik.',
    type: 'hackathon', mode: 'team', scope: 'local', domain: 'Web Development',
    difficulty: 'intermediate', prize: '₹50,000 + Internship Opportunity',
    deadline: new Date('2026-05-20'), teamSize: { min: 2, max: 4 },
    organizer: 'Nashik Municipal Corporation', isFeatured: true,
    tags: ['civic-tech', 'smart-city', 'local', 'impact']
  },
  {
    title: 'Google Solution Challenge 2026',
    description: 'Use Google technologies to address the UN Sustainable Development Goals. Open to university students worldwide.',
    type: 'hackathon', mode: 'team', scope: 'online', domain: 'Cloud & DevOps',
    difficulty: 'advanced', prize: '$5,000 + Google Mentorship',
    deadline: new Date('2026-06-01'), teamSize: { min: 2, max: 4 },
    organizer: 'Google', isFeatured: true,
    tags: ['google', 'cloud', 'firebase', 'UN-SDGs']
  },
  {
    title: 'AI for Social Good Challenge',
    description: 'Develop AI/ML solutions to solve real social problems — healthcare, education, agriculture, or environment.',
    type: 'challenge', mode: 'both', scope: 'online', domain: 'AI & Machine Learning',
    difficulty: 'intermediate', prize: '₹1,00,000 + Certificate',
    deadline: new Date('2026-05-30'), teamSize: { min: 1, max: 3 },
    organizer: 'Microsoft India', isFeatured: true,
    tags: ['AI', 'machine-learning', 'social-impact']
  },
  {
    title: 'GCOERC Internal Hackathon',
    description: 'Inter-department challenge for GCOERC students only. Build anything creative with tech. Perfect for first-time hackers.',
    type: 'hackathon', mode: 'team', scope: 'college', domain: 'Web Development',
    difficulty: 'beginner', prize: 'Certificate + ₹5,000 + Trophy',
    deadline: new Date('2026-04-25'), teamSize: { min: 2, max: 4 },
    organizer: 'GCOERC Student Council', isFeatured: false,
    tags: ['college', 'beginner-friendly', 'inter-department']
  },
  {
    title: 'Cybersecurity CTF 2026',
    description: 'Capture the Flag competition covering web security, cryptography, forensics, and reverse engineering challenges.',
    type: 'challenge', mode: 'solo', scope: 'online', domain: 'Cybersecurity',
    difficulty: 'advanced', prize: '₹25,000 + SwagKit',
    deadline: new Date('2026-05-10'), teamSize: { min: 1, max: 1 },
    organizer: 'OWASP India', isFeatured: false,
    tags: ['CTF', 'security', 'cryptography', 'web-security']
  },
  {
    title: 'E-Commerce UI/UX Design Sprint',
    description: 'Redesign a real local business\'s website. The best design gets implemented and your portfolio gets a live case study.',
    type: 'project', mode: 'both', scope: 'local', domain: 'UI/UX Design',
    difficulty: 'beginner', prize: 'Live Portfolio Project + ₹10,000',
    deadline: new Date('2026-04-30'), teamSize: { min: 1, max: 2 },
    organizer: 'Nashik Startup Hub', isFeatured: false,
    tags: ['design', 'UI/UX', 'Figma', 'local-business']
  },
  {
    title: 'AWS Buildathon India',
    description: 'Build a scalable cloud application using AWS services. Focus on serverless, containers, or AI/ML on AWS.',
    type: 'hackathon', mode: 'team', scope: 'company', domain: 'Cloud & DevOps',
    difficulty: 'advanced', prize: 'AWS Credits + $2,500 + Internship',
    deadline: new Date('2026-06-15'), teamSize: { min: 2, max: 5 },
    organizer: 'Amazon Web Services', isFeatured: true,
    tags: ['AWS', 'cloud', 'serverless', 'company-sponsored']
  },
  {
    title: 'Mini Web Dev Project: NGO Website',
    description: 'Build a website for a real Nashik-based NGO. Work with a real client, real brief, real deadline — real portfolio.',
    type: 'project', mode: 'solo', scope: 'local', domain: 'Web Development',
    difficulty: 'beginner', prize: 'Portfolio Project + Certificate',
    deadline: new Date('2026-05-05'), teamSize: { min: 1, max: 1 },
    organizer: 'SkillBridge Community', isFeatured: false,
    tags: ['portfolio', 'beginner', 'web-dev', 'NGO', 'local']
  },
  {
    title: 'Data Analytics Challenge: Agriculture',
    description: 'Analyze crop yield datasets from Maharashtra. Find patterns, build dashboards, present insights to real farmers.',
    type: 'challenge', mode: 'both', scope: 'online', domain: 'Data Science',
    difficulty: 'intermediate', prize: '₹15,000 + Mentorship',
    deadline: new Date('2026-05-25'), teamSize: { min: 1, max: 3 },
    organizer: 'Govt. of Maharashtra — AgriTech', isFeatured: false,
    tags: ['data', 'agriculture', 'analytics', 'Maharashtra']
  },
  {
    title: 'Android App Sprint: Campus Life',
    description: 'Build an Android app that solves a real campus problem — canteen, attendance, notices, or study groups.',
    type: 'project', mode: 'team', scope: 'college', domain: 'Android Development',
    difficulty: 'intermediate', prize: 'Certificate + ₹8,000',
    deadline: new Date('2026-05-12'), teamSize: { min: 2, max: 3 },
    organizer: 'GCOERC CSE Department', isFeatured: false,
    tags: ['android', 'campus', 'Kotlin', 'Firebase']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Community.deleteMany({});
    await Hackathon.deleteMany({});

    await Community.insertMany(communities);
    console.log(`✅ Seeded ${communities.length} communities`);

    await Hackathon.insertMany(hackathons);
    console.log(`✅ Seeded ${hackathons.length} hackathons`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
