import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | PhysicsLab",
  description: "Read the disclaimer regarding the educational nature of the content on PhysicsLab.",
};

export default function Disclaimer() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-16 w-full">
        <article className="prose prose-invert prose-indigo max-w-none">
          <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Medical & General <span className="text-amber-400">Disclaimer</span>
            </h1>
            <p className="text-[#94a3b8] text-lg">Last Updated: May 30, 2026</p>
          </header>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">1. Educational Purposes Only</h2>
            <p className="mb-4 leading-relaxed">
              The information and interactive simulations provided by PhysicsLab on https://physicslab.app are intended solely for educational and informational purposes. The Platform aims to assist students, educators, and enthusiasts in visualizing and understanding physical concepts. However, it does not constitute professional advice or absolute scientific truth in all contexts.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">2. Accuracy of Scientific Data</h2>
            <p className="mb-4 leading-relaxed">
              While we strive to ensure that our physics engines and mathematical models are as precise as possible, some simulations incorporate theoretical approximations, simplified constraints, or graphical abstractions to enhance learning. You should always consult standard, peer-reviewed educational literature to verify absolute numerical data for critical physical engineering computations.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">3. Not for Engineering Use</h2>
            <p className="mb-4 leading-relaxed">
              The Platform and its simulations must <strong>never</strong> be used for actual architectural, mechanical, electrical, or structural engineering problem-solving that affects human safety. We expressly refuse any liability relating to any direct or indirect injury, loss, or damage that occurs as a consequence of relying on the Platform&apos;s models to construct physical objects or systems in the real world.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">4. External Dependencies and Links</h2>
            <p className="mb-4 leading-relaxed">
              The Platform may contain links to third-party websites or services that are not owned or controlled by PhysicsLab. PhysicsLab has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that PhysicsLab shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">5. Professional Advice</h2>
            <p className="mb-4 leading-relaxed">
              No content published on this Platform constitutes a replacement for consultation with certified, professional educational advisors. You use the service entirely at your own risk.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
