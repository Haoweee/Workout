export const DataDeletion: React.FC = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Deletion Request</h1>
        <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Request Data Deletion</h2>
          <p className="text-gray-700 mb-4">
            You have the right to request deletion of your personal data from Workout App. To
            initiate a data deletion request:
          </p>
          <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
            <li>Log in to your account.</li>
            <li>Go to your profile or account settings.</li>
            <li>Find the "Delete Account" or "Request Data Deletion" option.</li>
            <li>Follow the instructions to confirm your request.</li>
          </ol>
          <p className="text-gray-700 mb-4">
            If you are unable to delete your account through the app, you may contact us directly:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> privacy@workoutapp.com
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Subject:</strong> Data Deletion Request
            </p>
            <p className="text-gray-700">
              <strong>Include:</strong> Your account email and username
            </p>
          </div>
          <p className="text-gray-700">
            We will process your request and delete your personal data within 30 days, except where
            retention is required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What Happens When Your Data Is Deleted?
          </h2>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li>
              Your account and all associated personal information will be permanently deleted.
            </li>
            <li>Workout history, routines, and progress data will be removed from our systems.</li>
            <li>
              Data may be retained for a limited period if required by law or for legitimate
              business purposes.
            </li>
          </ul>
          <p className="text-gray-700">
            After deletion, you will not be able to recover your account or any associated data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            For questions about data deletion or privacy, please contact:
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
