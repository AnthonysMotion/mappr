import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function CookiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="container mx-auto py-12 px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies allow websites to remember your actions and preferences over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
              <p>
                Mappr uses cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
                <li><strong>Security:</strong> To protect against fraud and ensure the security of your account</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how you use our service and improve functionality</li>
                <li><strong>Performance:</strong> To optimize the speed and performance of our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies as they are essential for the service to work.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Session Cookies:</strong> Maintain your login session while you use the service</li>
                <li><strong>Security Cookies:</strong> Help protect against unauthorized access and fraud</li>
                <li><strong>Authentication Cookies:</strong> Verify your identity and maintain your logged-in state</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Functional Cookies</h3>
              <p>
                These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Preference Cookies:</strong> Remember your display preferences and settings</li>
                <li><strong>Language Cookies:</strong> Remember your language preference</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Usage Analytics:</strong> Track which pages you visit and how long you spend on them</li>
                <li><strong>Performance Metrics:</strong> Monitor website performance and identify issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver content. These include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> Our backend infrastructure provider uses cookies for authentication and session management</li>
                <li><strong>Analytics Services:</strong> We may use analytics services that place cookies to help us understand user behavior</li>
              </ul>
              <p className="mt-4">
                These third-party cookies are subject to the respective third parties' privacy policies. We do not control these cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookie Duration</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Session Cookies</h3>
              <p>
                Session cookies are temporary and are deleted when you close your browser. They are used to maintain your session while you navigate the website.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Persistent Cookies</h3>
              <p>
                Persistent cookies remain on your device for a set period or until you delete them. They are used to remember your preferences and settings for future visits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Managing Cookies</h2>
              <p>
                You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Browser Settings</h3>
              <p>You can control cookies through your browser settings. Here are links to instructions for popular browsers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Impact of Disabling Cookies</h3>
              <p>
                If you choose to disable cookies, some features of Mappr may not function properly. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may need to log in every time you visit the website</li>
                <li>Your preferences and settings may not be saved</li>
                <li>Some features may be unavailable or limited</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Do Not Track Signals</h2>
              <p>
                Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted. As a result, Mappr does not currently respond to DNT browser signals or mechanisms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Updates to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Cookie Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@mappr.com<br />
                <strong>Website:</strong> <a href="https://anthonythach.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">anthonythach.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

