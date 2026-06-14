import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Physics Fundamentals",
  description: "Read the Terms and Conditions for using Physics Fundamentals' interactive learning platform.",
};

export default function TermsConditions() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-16 w-full">
        <article className="prose prose-invert prose-indigo max-w-none">
          <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Terms & <span className="text-cyan-400">Conditions</span>
            </h1>
            <p className="text-[#94a3b8] text-lg">Last Updated: May 30, 2026</p>
          </header>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4 leading-relaxed">
              By accessing and using PhysicsLab (the &quot;Platform&quot;), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Platform&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="mb-4 leading-relaxed">
              PhysicsLab provides an interactive educational platform offering physics simulations and visual learning tools. The materials provided are for informational and educational purposes only. We reserve the right to modify, suspend, or discontinue any aspect of the Platform at any time, including the availability of any site feature, database, or content.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">3. User Conduct</h2>
            <p className="mb-4 leading-relaxed">
              You agree to use the Platform only for lawful purposes. You agree not to take any action that might compromise the security of the Platform, render the Platform inaccessible to others or otherwise cause damage to the Platform or the Content. You agree not to add to, subtract from, or otherwise modify the Content, or to attempt to access any Content that is not intended for you.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-cyan-500">
              <li>Do not use the Platform for unauthorized or illegal activity.</li>
              <li>Do not copy, distribute, or disclose any part of the Platform in any medium.</li>
              <li>Do not attempt to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Platform.</li>
            </ul>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
            <p className="mb-4 leading-relaxed">
              All content and materials available on PhysicsLab, including but not limited to the interactive simulations, graphics, text, logos, and software, are the property of PhysicsLab or its licensors and are protected by applicable intellectual property laws. You may not reproduce, create derivative works from, or distribute any part of the Platform without our explicit written permission.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
            <p className="mb-4 leading-relaxed">
              Your use of the Platform is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. PhysicsLab expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
            <p className="mb-4 leading-relaxed">
              In no event shall PhysicsLab, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Platform.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">7. Governing Law</h2>
            <p className="mb-4 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
