import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="container mx-auto py-12 px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Mappr ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
              <p>
                Mappr is a travel planning application that allows users to create, organize, and share trip itineraries, locations, and travel-related information. The Service includes features for creating trips, adding pins to maps, categorizing locations, and collaborating with other users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Account Creation</h3>
              <p>To use certain features of the Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create an account by providing accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
                <li>Be at least 13 years of age (or the age of majority in your jurisdiction)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Account Responsibility</h3>
              <p>
                You are responsible for all activities that occur under your account. You agree not to share your account credentials with others or allow others to access your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Acceptable Use</h2>
              <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Upload, post, or transmit any content that is illegal, harmful, threatening, abusive, or offensive</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
                <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
                <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Use the Service to transmit viruses, malware, or other harmful code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Content</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Ownership</h3>
              <p>
                You retain ownership of all content you create, upload, or post to the Service ("User Content"). By posting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your User Content solely for the purpose of providing and improving the Service.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Content Responsibility</h3>
              <p>
                You are solely responsible for your User Content. You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have the right to post the User Content</li>
                <li>Your User Content does not violate any third-party rights</li>
                <li>Your User Content is accurate and not misleading</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Content Removal</h3>
              <p>
                We reserve the right to remove any User Content that violates these Terms or that we determine, in our sole discretion, is harmful, offensive, or inappropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Collaboration and Sharing</h2>
              <p>
                The Service allows you to share trips with other users and collaborate on travel planning. When you share a trip:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You control who has access to your shared trips</li>
                <li>Collaborators with "editor" or "owner" roles can modify trip content</li>
                <li>You are responsible for managing collaborator permissions</li>
                <li>We are not responsible for disputes between collaborators</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
              <p>
                The Service, including its original content, features, and functionality, is owned by Mappr and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Service Availability</h2>
              <p>
                We strive to provide reliable service but do not guarantee that the Service will be available at all times. The Service may be unavailable due to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Scheduled maintenance</li>
                <li>Technical issues or failures</li>
                <li>Circumstances beyond our control</li>
              </ul>
              <p className="mt-4">
                We reserve the right to modify, suspend, or discontinue the Service at any time with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Mappr and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of or related to your use of the Service, your User Content, or your violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">12. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately, and we may delete your account and associated data.
              </p>
              <p className="mt-4">
                You may terminate your account at any time by contacting us or using the account deletion feature in your profile settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Mappr operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-8 mb-4">15. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@mappr.com<br />
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

