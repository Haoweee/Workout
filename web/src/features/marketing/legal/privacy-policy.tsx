export const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Welcome to Workout App ("we," "our," or "us"). This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use our fitness tracking
            application and related services (the "Service").
          </p>
          <p className="text-gray-700">
            By using our Service, you agree to the collection and use of information in accordance
            with this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

          <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
          <p className="text-gray-700 mb-4">
            We may collect personally identifiable information that you provide to us, including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Name and email address</li>
            <li>Profile information (age, fitness goals, preferences)</li>
            <li>Account credentials</li>
            <li>Profile pictures or avatars</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-3">Fitness Data</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Workout routines and exercise data</li>
            <li>Performance metrics (sets, reps, weights, duration)</li>
            <li>Fitness progress and achievements</li>
            <li>Custom exercises and routines you create</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-800 mb-3">Usage Information</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>App usage patterns and features accessed</li>
            <li>Device information (device type, operating system)</li>
            <li>Log data (IP address, browser type, access times)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the collected information for various purposes:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>To provide and maintain our Service</li>
            <li>To track your fitness progress and provide personalized recommendations</li>
            <li>To improve our Service and develop new features</li>
            <li>To communicate with you about updates and important notices</li>
            <li>To ensure the security and integrity of our Service</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Information Sharing and Disclosure
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties,
            except in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>With your explicit consent</li>
            <li>To comply with legal requirements or law enforcement requests</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>In connection with a business transaction (merger, acquisition, etc.)</li>
            <li>
              With service providers who assist in operating our Service (under strict
              confidentiality agreements)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Encryption of data in transit and at rest</li>
            <li>Secure authentication and access controls</li>
            <li>Regular security assessments and updates</li>
            <li>Limited access to personal information on a need-to-know basis</li>
          </ul>
          <p className="text-gray-700">
            However, no method of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
          <p className="text-gray-700">
            We retain your personal information only for as long as necessary to provide our Service
            and fulfill the purposes outlined in this Privacy Policy. When you delete your account,
            we will delete your personal information within 30 days, except where we are required to
            retain it by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Privacy Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>Access your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Delete your personal information</li>
            <li>Export your data in a portable format</li>
            <li>Opt out of certain communications</li>
            <li>Withdraw consent where processing is based on consent</li>
          </ul>
          <p className="text-gray-700">
            To exercise these rights, please contact us using the information provided below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700">
            Our Service is not intended for children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you become aware that a child
            has provided us with personal information, please contact us, and we will take steps to
            remove such information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the "Last updated" date. You
            are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> privacy@workoutapp.com
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
