export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col items-start justify-center w-full max-w-md h-full p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <div className="text-md space-y-4">
        <p>
          <strong>Effective Date: May 13, 2025</strong>
        </p>
        <p>
          At WinStreak Sports, we value your privacy and are committed to
          protecting your personal information. This Privacy Policy explains how
          we collect, use, and share your information when you use our services.
        </p>
        <h2 className="font-semibold">1. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc ml-6">
          <li>
            <strong>Personal Information:</strong> such as your name, email
            address, and other contact details when you register or participate
            in a contest.
          </li>
          <li>
            <strong>Usage Data:</strong> including information about how you use
            our website or app, such as page views, clicks, and device
            information.
          </li>
        </ul>
        <h2 className="font-semibold">2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc ml-6">
          <li>Provide and improve our services</li>
          <li>Facilitate your participation in contests</li>
          <li>Communicate with you about updates, promotions, and results</li>
          <li>
            Ensure compliance with our terms of service and legal obligations
          </li>
        </ul>
        <h2 className="font-semibold">3. Sharing Your Information</h2>
        <p>
          We do not sell or rent your personal information to third parties.
          However, we may share your information with the sponsors of contests
          you choose to enter, solely for the purpose of contest administration,
          fulfillment, and related promotional activities.
        </p>
        <p>
          We will never share your information with sponsors of contests you do
          not enter.
        </p>
        <h2 className="font-semibold">4. Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures to
          protect your personal information from unauthorized access,
          disclosure, or loss.
        </p>
        <h2 className="font-semibold">5. Your Choices</h2>
        <p>You can:</p>
        <ul className="list-disc ml-6">
          <li>Access and update your account information</li>
          <li>Opt out of promotional communications</li>
          <li>
            Request the deletion of your personal data, subject to legal and
            operational requirements
          </li>
        </ul>
        <h2 className="font-semibold">6. Children’s Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 18. We
          do not knowingly collect personal information from children without
          parental consent.
        </p>
        <h2 className="font-semibold">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will post the updated policy with a new effective date. We encourage
          you to review this page periodically.
        </p>
        <h2 className="font-semibold">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <ul className="list-disc ml-6">
          <li>
            Email:{" "}
            <a href="mailto:ben@winstreaksports.com" className="underline">
              ben@winstreaksports.com
            </a>
          </li>
          <li>
            Mailing Address: 1007 N Orange St., 4th Floor Suite, #3911,
            Wilmington, Delaware, 19801
          </li>
        </ul>
      </div>
    </div>
  );
}
