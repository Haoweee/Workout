export const TermsOfService: React.FC = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using Workout App ("Service"), you agree to be bound by these Terms of
            Service ("Terms"). If you do not agree to these Terms, you may not access or use the
            Service.
          </p>
          <p className="text-gray-700">
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            Workout App is a fitness tracking application that allows users to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Create and manage workout routines</li>
            <li>Track exercise performance and progress</li>
            <li>Access exercise databases and instructions</li>
            <li>Monitor fitness goals and achievements</li>
            <li>Store and analyze workout data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Account Creation</h3>
          <p className="text-gray-700 mb-4">
            To access certain features of the Service, you must create an account. You agree to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your account information</li>
            <li>Keep your password secure and confidential</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-3">Account Termination</h3>
          <p className="text-gray-700">
            We reserve the right to suspend or terminate your account at any time for violation of
            these Terms or for any other reason at our discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
          <p className="text-gray-700 mb-4">You agree not to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Transmit viruses, malware, or other harmful code</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Create multiple accounts to evade restrictions</li>
            <li>Share inappropriate, offensive, or harmful content</li>
            <li>Reverse engineer or attempt to extract source code</li>
            <li>Use automated systems to access the Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. User Content</h2>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Content Ownership</h3>
          <p className="text-gray-700 mb-4">
            You retain ownership of content you submit to the Service ("User Content"). By
            submitting User Content, you grant us a non-exclusive, worldwide, royalty-free license
            to use, modify, and display your content solely to provide the Service.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mb-3">Content Standards</h3>
          <p className="text-gray-700 mb-4">All User Content must:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Be accurate and not misleading</li>
            <li>Not infringe on others' intellectual property rights</li>
            <li>Not contain harmful, offensive, or inappropriate material</li>
            <li>Comply with applicable laws and regulations</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-3">Content Removal</h3>
          <p className="text-gray-700">
            We reserve the right to remove any User Content that violates these Terms or is
            otherwise objectionable in our sole discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Health and Safety Disclaimer
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-800 font-medium">Important Health Notice</p>
            <p className="text-yellow-700 mt-2">
              The Service provides fitness tracking tools and general information only. It is not
              intended as medical advice or professional fitness guidance.
            </p>
          </div>
          <p className="text-gray-700 mb-4">
            Before beginning any exercise program or using our Service:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Consult with a qualified healthcare provider</li>
            <li>Ensure you are physically able to participate in exercise</li>
            <li>Stop exercising if you experience pain or discomfort</li>
            <li>Use proper form and appropriate weights</li>
          </ul>
          <p className="text-gray-700">
            You assume all risk and responsibility for your use of the Service and any exercises
            performed using our guidance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            The Service and its original content, features, and functionality are owned by us and
            are protected by international copyright, trademark, and other intellectual property
            laws.
          </p>
          <p className="text-gray-700">
            You may not reproduce, distribute, modify, or create derivative works of our content
            without explicit written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Privacy</h2>
          <p className="text-gray-700">
            Your privacy is important to us. Please review our Privacy Policy, which also governs
            your use of the Service, to understand our practices regarding the collection and use of
            your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Disclaimers and Limitation of Liability
          </h2>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Service Disclaimer</h3>
          <p className="text-gray-700 mb-4">
            The Service is provided "as is" and "as available" without warranties of any kind. We
            disclaim all warranties, express or implied, including warranties of merchantability,
            fitness for a particular purpose, and non-infringement.
          </p>

          <h3 className="text-lg font-medium text-gray-800 mb-3">Limitation of Liability</h3>
          <p className="text-gray-700">
            To the fullest extent permitted by law, we shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, including loss of profits,
            data, or other intangible losses, resulting from your use of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
          <p className="text-gray-700">
            You agree to indemnify and hold us harmless from any claims, damages, losses, or
            expenses arising from your use of the Service, violation of these Terms, or infringement
            of any rights of a third party.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Termination</h2>
          <p className="text-gray-700 mb-4">
            We may terminate or suspend your access to the Service immediately, without prior notice
            or liability, for any reason, including breach of these Terms.
          </p>
          <p className="text-gray-700">
            Upon termination, your right to use the Service will cease immediately. All provisions
            that by their nature should survive termination shall survive, including ownership
            provisions, warranty disclaimers, and limitations of liability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of [Your
            State/Country], without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify or replace these Terms at any time. If a revision is
            material, we will provide at least 30 days notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> legal@workoutapp.com
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> [Your Business Address]
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> [Your Contact Phone]
            </p>
          </div>
        </section>
      </div>
    </>
  );
};
