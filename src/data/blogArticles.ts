export interface ArticleSection {
  type: "h2" | "h3" | "p" | "formula" | "quote" | "list" | "video" | "image";
  id?: string;
  content?: any;
  label?: string;
  author?: string;
  items?: string[][] | string[];
  src?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  authorInitials: string;
  authorBg: string;
  category: string;
  sections: ArticleSection[];
  toc: { id: string; label: string }[];
}

export const blogArticles: Article[] = [
  {
    slug: "electric-charge-coulombs-law",
    title: "Electric Charge and Coulomb's Law Explained",
    excerpt: "Everything electrical begins with one fundamental property of matter: electric charge. The force between charges, described by Coulomb's Law, is the bedrock of electromagnetism.",
    date: "Apr 30, 2026",
    readTime: "14 min read",
    author: "Dr. Sarah Kim",
    authorInitials: "SK",
    authorBg: "bg-amber-700",
    category: "ELECTROMAGNETISM",
    toc: [
      { id: "introduction", label: "Introduction" },
      { id: "what-is-charge", label: "What is Electric Charge?" },
      { id: "quantization", label: "Quantization & Conservation" },
      { id: "coulombs-law", label: "Coulomb's Law Formula" },
      { id: "inverse-square", label: "The Inverse Square Law" },
      { id: "worked-examples", label: "Worked Examples" },
      { id: "applications", label: "Real-World Applications" },
      { id: "summary", label: "Summary" },
    ],
    sections: [
      { type: "h2", id: "introduction", content: "Introduction" },
      { type: "p", content: "From the lightning that streaks across a storm-torn sky to the subtle signals moving through your brain, electricity is the engine of the modern world. At the heart of it all lies a single, fundamental concept: electric charge. Understanding how these charges interact—pushed and pulled by forces across empty space—is the challenge Coulomb's Law solves for us." },
      { type: "h2", id: "what-is-charge", content: "What is Electric Charge?" },
      { type: "p", content: "Electric charge is an intrinsic physical property of matter that causes it to experience a force when placed in an electromagnetic field. Unlike mass, which only comes in 'positive' (attractive) flavor, charge comes in two types: Positive (+) and Negative (-)." },
      { type: "quote", author: "Benjamin Franklin", content: "I have the same feeling about the two types of electricity. They are not different fluids, but a surplus or deficit of the same fundamental essence." },
      { type: "h2", id: "quantization", content: "Quantization & Conservation" },
      { type: "p", content: "Charge is quantized, meaning it exists in discrete packets. The smallest unit of free charge is the 'elementary charge' (e), approximately 1.602 × 10⁻¹⁹ Coulombs. Every proton has +e, and every electron has -e." },
      { type: "h2", id: "coulombs-law", content: "Coulomb's Law Formula" },
      { type: "p", content: "In 1785, Charles-Augustin de Coulomb published his observations on the force between two charged particles. He discovered that the force is proportional to the product of the charges and inversely proportional to the square of the distance between them." },
      { type: "formula", label: "Coulomb's Law", content: "F = k * (|q₁ * q₂| / r²)" },
      { type: "list", items: [
        ["F", "The magnitude of the electrostatic force (Newtons)"],
        ["q₁, q₂", "The magnitudes of the two point charges (Coulombs)"],
        ["r", "The distance between the centers of the charges (Meters)"],
        ["k", "Coulomb's Constant (≈ 8.99 × 10⁹ N·m²/C²)"]
      ]},
      { type: "video", src: "https://www.youtube.com/embed/rYjo774UpHI" },
      { type: "h2", id: "worked-examples", content: "Worked Examples" },
      { type: "p", content: "Two point charges, +2μC and -5μC, are placed 10cm apart. Calculate the magnitude of the attractive force." },
      { type: "p", content: "F = (8.99e9 * |2e-6 * -5e-6|) / (0.1)² = 8.99N. Since the charges have opposite signs, the force is attractive." },
      { type: "h2", id: "summary", content: "Summary" },
      { type: "p", content: "Coulomb's Law is the electrical equivalent of Newton's Law of Universal Gravitation. Mastery of this relationship is essential for moving into Electric Fields and Potential." }
    ]
  },
  {
    slug: "ohms-law-explained",
    title: "Ohm's Law Explained: V = IR, Resistance and Examples",
    excerpt: "Every electronic device operations according to a single elegant relationship: Ohm's Law. Learn how voltage, current, and resistance interact.",
    date: "May 1, 2026",
    readTime: "13 min read",
    author: "Dr. Sarah Kim",
    authorInitials: "SK",
    authorBg: "bg-amber-700",
    category: "ELECTROMAGNETISM",
    toc: [
      { id: "introduction", label: "Introduction" },
      { id: "the-triangle", label: "The V-I-R Triangle" },
      { id: "voltage", label: "Voltage: Electrical Pressure" },
      { id: "current", label: "Current: Electrical Flow" },
      { id: "resistance", label: "Resistance: The Obstruction" },
      { id: "worked-examples", label: "Worked Examples" },
      { id: "limitations", label: "Ohmic vs Non-Ohmic" },
      { id: "summary", label: "Summary" },
    ],
    sections: [
      { type: "h2", id: "introduction", content: "Introduction" },
      { type: "p", content: "Imagine water flowing through a pipe. The pressure pushing the water is like Voltage. The flow of water itself is the Current. The narrowness of the pipe is the Resistance. This analogy perfectly captures the essence of Ohm's Law." },
      { type: "h2", id: "the-triangle", content: "The V-I-R Triangle" },
      { type: "p", content: "For many materials, the current flowing through them is directly proportional to the voltage applied, provided the temperature remains constant." },
      { type: "formula", label: "Ohm's Law", content: "V = I * R" },
      { type: "list", items: [
        ["V", "Voltage (Potential Difference) measured in Volts (V)"],
        ["I", "Current (Flow rate) measured in Amperes (A)"],
        ["R", "Resistance (Opposition) measured in Ohms (Ω)"]
      ]},
      { type: "video", src: "https://www.youtube.com/embed/GsVn-G9M770" },
      { type: "h2", id: "resistance", content: "Resistance: The Obstruction" },
      { type: "p", content: "Resistance depends on the material, length, cross-sectional area, and temperature. A long, thin wire has more resistance than a short, thick one." },
      { type: "h2", id: "worked-examples", content: "Worked Examples" },
      { type: "p", content: "If a 12V battery is connected to a lightbulb with a resistance of 4Ω, what is the current?" },
      { type: "p", content: "I = V / R = 12 / 4 = 3 Amperes." },
      { type: "h2", id: "summary", content: "Summary" },
      { type: "p", content: "Ohm's Law is the most fundamental tool for any electrical engineer or hobbyist. Always check if your component is 'Ohmic' before relying on it!" }
    ]
  },
  {
    slug: "circular-motion-centripetal-force",
    title: "Circular Motion and Centripetal Force: Complete Physics Guide",
    excerpt: "A ball whirled on a string, a car rounding a bend, the Moon orbiting Earth — all are in circular motion. Master the kinematics of rotation.",
    date: "May 3, 2026",
    readTime: "14 min read",
    author: "Dr. Marcus Webb",
    authorInitials: "MW",
    authorBg: "bg-emerald-800",
    category: "CLASSICAL MECHANICS",
    toc: [
      { id: "introduction", label: "Introduction" },
      { id: "what-is-circular-motion", label: "What Is Circular Motion?" },
      { id: "centripetal-acceleration", label: "Centripetal Acceleration" },
      { id: "centripetal-force", label: "Centripetal Force" },
      { id: "worked-examples", label: "Worked Examples" },
      { id: "summary", label: "Summary" },
    ],
    sections: [
      { type: "h2", id: "introduction", content: "Introduction" },
      { type: "p", content: "When an object moves in a circle, its velocity is constantly changing direction. Even if its speed is constant, it is accelerating. This acceleration requires a force, which we call the Centripetal Force." },
      { type: "formula", label: "Centripetal Force", content: "F = m * (v² / r)" },
      { type: "video", src: "https://www.youtube.com/embed/Z0XW9_0p96I" },
      { type: "h2", id: "summary", content: "Summary" },
      { type: "p", content: "Understanding that centripetal force is not a 'new' force, but a role played by others (like gravity or tension), is the key to solving complex mechanics problems." }
    ]
  }
];
