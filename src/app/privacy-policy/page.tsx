import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PhysicsLab",
  description: "Read the Privacy Policy for PhysicsLab to understand how we handle your data and protect your privacy.",
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-16 w-full">
        <article className="prose prose-invert prose-indigo max-w-none">
          <header className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Privacy <span className="text-indigo-400">Policy</span>
            </h1>
            <p className="text-[#94a3b8] text-lg">Last Updated: May 30, 2026</p>
          </header>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="mb-4 leading-relaxed">
              Welcome to PhysicsLab (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices regarding your personal information, please contact us.
            </p>
            <p className="leading-relaxed">
              When you visit our website https://physicslab.app (the &quot;Website&quot;), and more generally, use any of our services (the &quot;Services&quot;, which include the Website), we appreciate that you are trusting us with your personal information. We take your privacy very seriously.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <p className="mb-4 leading-relaxed">
              <strong>Personal information you disclose to us.</strong> We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Website, or otherwise when you contact us.
            </p>
            <p className="mb-4 leading-relaxed">
              <strong>Information automatically collected.</strong> We automatically collect certain information when you visit, use, or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website, and other technical information.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4 leading-relaxed">
              We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. Some specific uses include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-indigo-500">
              <li>To facilitate account creation and logon process.</li>
              <li>To send administrative information to you.</li>
              <li>To fulfill and manage your specific simulation requests or purchases.</li>
              <li>To request feedback and to contact you about your use of our Website.</li>
              <li>To protect our Services from security threats or fraud.</li>
            </ul>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">4. Sharing Your Information</h2>
            <p className="mb-4 leading-relaxed">
              We only share and disclose your information in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-indigo-500">
              <li><strong>Compliance with Laws:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
              <li><strong>Vital Interests and Legal Rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
              <li><strong>Vendors, Consultants, and Other Third-Party Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work.</li>
            </ul>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">5. Security of Your Information</h2>
            <p className="mb-4 leading-relaxed">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section className="mb-10 text-[#c7d2fe]">
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions or comments about this notice, you may email us at privacy@physicslab.app or by post to our registered office address.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
