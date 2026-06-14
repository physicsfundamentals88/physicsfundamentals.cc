import { getDb } from "@/db";
import { articles } from "@/db/schema";
import { desc } from "drizzle-orm";

export const runtime = "edge";

const baseUrl = "https://physicslab.app";

const calculatorsList = [
  { slug: "capacitance", name: "Capacitance Solver", desc: "Calculate capacitance, charge, voltage, and stored energy for capacitors." },
  { slug: "centripetal-force", name: "Centripetal Force Solver", desc: "Solve for centripetal force, mass, velocity, and radius of circular motion." },
  { slug: "circular-motion", name: "Circular Motion Solver", desc: "Solve angular velocity, linear speed, period, frequency, and acceleration." },
  { slug: "coulombs-law", name: "Coulomb's Law Solver", desc: "Solve electrostatic force, charges, and distance between two point charges." },
  { slug: "doppler-effect", name: "Doppler Effect Solver", desc: "Solve observed frequency changes due to moving sources and observers." },
  { slug: "escape-velocity", name: "Escape Velocity Solver", desc: "Calculate escape velocity for planets and stars based on mass and radius." },
  { slug: "free-fall", name: "Free Fall Kinematics Solver", desc: "Determine height, final velocity, and time for free-falling bodies." },
  { slug: "frequency", name: "Frequency & Wavelength Solver", desc: "Convert between frequency, period, wavelength, and wave speed." },
  { slug: "gravitational-potential-energy", name: "Gravitational Potential Energy Solver", desc: "Calculate potential energy, mass, height, and gravity." },
  { slug: "ideal-gas-law", name: "Ideal Gas Law Solver", desc: "Solve PV = nRT for pressure, volume, temperature, and moles." },
  { slug: "kinetic-energy", name: "Kinetic Energy Solver", desc: "Solve for kinetic energy, mass, and velocity of moving objects." },
  { slug: "momentum", name: "Momentum & Impulse Solver", desc: "Calculate momentum, mass, velocity, force, and time of impact." },
  { slug: "newtons-second-law", name: "Newton's Second Law Solver", desc: "Calculate net force, mass, and acceleration (F = ma)." },
  { slug: "ohms-law", name: "Ohm's Law Solver", desc: "Determine voltage, current, resistance, and power in electric circuits." },
  { slug: "pressure-density", name: "Pressure & Density Solver", desc: "Solve hydrostatic pressure, density, depth, and force." },
  { slug: "projectile-motion", name: "Projectile Motion Solver", desc: "Calculate range, maximum height, flight time, and components of trajectories." },
  { slug: "snells-law", name: "Snell's Law (Refraction) Solver", desc: "Solve refractive indices, angle of incidence, and angle of refraction." },
  { slug: "thermal-expansion", name: "Thermal Expansion Solver", desc: "Calculate linear and volumetric expansion due to temperature change." },
  { slug: "wave-speed", name: "Wave Speed Solver", desc: "Solve wave velocity, frequency, and wavelength." },
  { slug: "work-power", name: "Work & Power Solver", desc: "Determine work done, force, distance, power output, and time." }
];

export async function GET() {
  let dbArticles: any[] = [];
  try {
    const db = getDb();
    dbArticles = await db
      .select({
        title: articles.title,
        excerpt: articles.excerpt,
        slug: articles.slug,
        category: articles.category
      })
      .from(articles)
      .orderBy(desc(articles.createdAt));
  } catch (e) {
    console.error("Failed to fetch articles for llms.txt:", e);
  }

  let markdown = `# Physics Fundamentals

> Physics Fundamentals is an educational platform dedicated to teaching physics through detailed explanations, formulas, derivations, solved examples, and structured learning paths covering classical mechanics, waves, thermodynamics, electromagnetism, optics, and modern physics.

## Core Navigation
- [Home](${baseUrl}/): Main dashboard with topic hubs, featured articles, and quick solvers.
- [About Us](${baseUrl}/about): Learn about our pedagogical philosophy, research-backed credentials, and team.
- [Contact](${baseUrl}/contact): Get in touch with us.
- [Roadmap](${baseUrl}/roadmap): Structured curriculum pathways showing how concepts connect.
- [Interactive Simulations](${baseUrl}/simulations): Playable physics engines and visual games.

## Category Hubs
- [Classical Mechanics](${baseUrl}/category/classical-mechanics): Learn and solve forces, kinematics, energy, and orbital mechanics.
- [Electromagnetism](${baseUrl}/category/electromagnetism): Master charge, circuits, fields, light, and refraction.
- [Thermodynamics](${baseUrl}/category/thermodynamics): Understand heat transfer, gas laws, thermal expansion, and entropy.
- [Waves & Optics](${baseUrl}/category/waves-optics): Study oscillations, wave propagation, sound, and refraction properties.

## Step-by-Step Solvers & Calculators
Physics Fundamentals provides interactive calculators that explain every algebraic and physical step to solve variables.

`;

  calculatorsList.forEach((calc) => {
    markdown += `- [${calc.name}](${baseUrl}/calculators/${calc.slug}): ${calc.desc}\n`;
  });

  markdown += `\n## Written Guides & Articles\nIn-depth, conceptually-grounded tutorials written by physics instructors.\n\n`;

  if (dbArticles.length > 0) {
    dbArticles.forEach((art) => {
      const excerpt = art.excerpt || "Comprehensive guide and derivation.";
      const category = art.category ? `[${art.category}] ` : "";
      markdown += `- [${art.title}](${baseUrl}/blog/${art.slug}): ${category}${excerpt}\n`;
    });
  } else {
    markdown += `- [Newton's Laws of Motion](${baseUrl}/blog/newtons-laws): Foundations of classical dynamics.\n`;
    markdown += `- [Understanding Snell's Law](${baseUrl}/blog/snells-law-explained): Refraction and refractive indices index guide.\n`;
    markdown += `- [The Ideal Gas Law](${baseUrl}/blog/ideal-gas-law-derivation): Deep dive into PV = nRT and kinetic theory.\n`;
  }

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=18000"
    }
  });
}
