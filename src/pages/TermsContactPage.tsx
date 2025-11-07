import React, { useEffect, useState } from 'react';

const termSectionIds = ['section-1','section-2','section-3','section-4','section-5','section-6'];

export const TermsContactPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('section-contact');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);


  // Hide all terms sections initially (contact shown by default)
  useEffect(() => {
    termSectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }, []);

  const showSection = (id: string) => {
    setActiveSection(id);
    // hide all
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.classList.add('hidden'));
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
    // no search on this page; simply show/hide the selected section
  // clear any previous no-results state
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // simple validation
    if (!contactName || !contactEmail || !contactSubject || !contactMessage) return;
    setShowSuccess(true);
    setContactName(''); setContactEmail(''); setContactSubject(''); setContactMessage('');
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // No search functionality on this page; contact form and static terms only

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Website Information Hub</h1>
        <p className="text-lg text-gray-600">Explore our Terms of Use or submit a query to our support team using the contact form below.</p>
      </header>

      {/* No search box on this page */}

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4">
          <nav className="sticky top-6">
            <ul className="flex flex-col gap-2" id="nav-menu">
              <li>
                <button onClick={() => showSection('section-contact')} className={`nav-button w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors duration-150 ${activeSection==='section-contact' ? 'active' : ''}`} data-target="section-contact">Contact Us</button>
              </li>
              <li className="border-t pt-2 mt-2 text-sm font-semibold text-gray-500">TERMS OF USE</li>
              <li><button onClick={() => showSection('section-1')} className={`nav-button w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors duration-150 ${activeSection==='section-1' ? 'active' : ''}`} data-target="section-1">1. Using Our Site</button></li>
              <li><button onClick={() => showSection('section-2')} className={`nav-button w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors duration-150 ${activeSection==='section-2' ? 'active' : ''}`} data-target="section-2">2. Rules for Posting Ads</button></li>
              <li><button onClick={() => showSection('section-3')} className={`nav-button w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors duration-150 ${activeSection==='section-3' ? 'active' : ''}`} data-target="section-3">3. Dealing with Other Users</button></li>
              <li><button onClick={() => showSection('section-4')} className={`nav-button w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors duration-150 ${activeSection==='section-4' ? 'active' : ''}`} data-target="section-4">4. Intellectual Property</button></li>
              <li><button onClick={() => showSection('section-5')} className={`nav-button w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors duration-150 ${activeSection==='section-5' ? 'active' : ''}`} data-target="section-5">5. Disclaimers and Liability</button></li>
              <li><button onClick={() => showSection('section-6')} className={`nav-button w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors duration-150 ${activeSection==='section-6' ? 'active' : ''}`} data-target="section-6">6. General Legal Terms</button></li>
            </ul>
          </nav>
        </aside>

        <main className="w-full md:w-3/4">
          <div id="content-container" className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <div id="section-contact" className="content-section space-y-6">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Get In Touch</h2>
              <p className="text-gray-700">Use the form below to submit an inquiry, report an issue, or send us general feedback. We aim to respond within 48 hours.</p>

              <form id="contactForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input id="contactName" value={contactName} onChange={(e)=>setContactName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input id="contactEmail" type="email" value={contactEmail} onChange={(e)=>setContactEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="contactSubject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select id="contactSubject" value={contactSubject} onChange={(e)=>setContactSubject(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">-- Select a subject --</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Report an Ad/User">Report an Ad/User</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contactMessage" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea id="contactMessage" value={contactMessage} onChange={(e)=>setContactMessage(e.target.value)} rows={5} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe your query in detail..."></textarea>
                </div>
                <button type="submit" id="submitButton" className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">Send Message</button>
              </form>

              {showSuccess && (
                <div id="successMessage" className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg mt-4" role="alert">
                  <p className="font-semibold">Success! Your message has been received.</p>
                  <p className="text-sm">We appreciate your feedback and will get back to you soon.</p>
                </div>
              )}
            </div>

            {/* Terms sections - initially hidden except contact */}
            <div id="section-1" className="content-section space-y-4 hidden">
              <h2 className="text-2xl font-bold mb-4">1. Using Our Site</h2>
              <h3 className="text-xl font-semibold">Agreement to Rules</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>You agree to these Terms and all applicable laws.</li>
                <li>We can change these Terms at any time. We will post updates here.</li>
                <li>Continued use means you accept the new changes.</li>
              </ul>
              <h3 className="text-xl font-semibold">Eligibility</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>You must be at least 18 years old to use the Site.</li>
                <li>You must have the legal right to enter into this agreement.</li>
              </ul>
              <h3 className="text-xl font-semibold">Your Account</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>You are responsible for keeping your password secret.</li>
                <li>You are responsible for all activity under your account.</li>
                <li>Tell us immediately if you think your account is unauthorized.</li>
              </ul>
            </div>

            <div id="section-2" className="content-section space-y-4 hidden">
              <h2 className="text-2xl font-bold mb-4">2. Rules for Posting Ads</h2>
              <h3 className="text-xl font-semibold">Your Content</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>You are fully responsible for the ads and content you post.</li>
                <li>Ads must be accurate, truthful, and complete.</li>
                <li>You must own the rights to all text, images, and media you post.</li>
              </ul>
              <h3 className="text-xl font-semibold">Forbidden Content</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong className="text-gray-900">Do not post anything illegal.</strong> This includes stolen goods or illegal services.</li>
                <li><strong className="text-gray-900">Do not post spam.</strong> This means repetitive or misleading ads.</li>
                <li><strong className="text-gray-900">Do not post hateful or offensive content.</strong> This includes anything violent, harassing, or discriminatory.</li>
                <li><strong className="text-gray-900">Do not post ads that infringe on copyrights or trademarks.</strong></li>
                <li><strong className="text-gray-900">Do not post ads for harmful or controlled items</strong> (like weapons, drugs, or specific regulated items).</li>
                <li><strong className="text-gray-900">Do not collect other users' data</strong> for commercial purposes.</li>
              </ul>
              <h3 className="text-xl font-semibold">Site's Right to Remove</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>We can remove any ad at any time, for any reason.</li>
                <li>We do not need to give you notice.</li>
                <li>We can also terminate your account if you break these rules.</li>
              </ul>
            </div>

            <div id="section-3" className="content-section space-y-4 hidden">
              <h2 className="text-2xl font-bold mb-4">3. Dealing with Other Users</h2>
              <h3 className="text-xl font-semibold">We Are Just a Platform</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>We are a neutral venue. We only connect buyers and sellers.</li>
                <li>We are <strong className="text-gray-900">not</strong> involved in the actual transaction.</li>
                <li>We do not vet or guarantee users or their listings.</li>
                <li><strong className="text-gray-900">We do not process payments or charge transaction fees.</strong> All financial terms are set and handled directly between the buyer and seller.</li>
              </ul>
              <h3 className="text-xl font-semibold">Your Responsibility</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>You must handle all communication and transactions directly.</li>
                <li>You should conduct your own research before meeting or paying anyone.</li>
                <li>We are not liable for any losses, scams, or damages from your transactions.</li>
              </ul>
            </div>

            <div id="section-4" className="content-section space-y-4 hidden">
              <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
              <h3 className="text-xl font-semibold">Your License to Us</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>When you post content, you give us a permanent, worldwide, royalty-free license.</li>
                <li>This lets us use, display, reproduce, and distribute your content on the Site.</li>
              </ul>
              <h3 className="text-xl font-semibold">Site Content</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>All Site design, graphics, and code are owned by us or our licensors.</li>
                <li>You cannot copy, distribute, or modify our Site materials without permission.</li>
              </ul>
            </div>

            <div id="section-5" className="content-section space-y-4 hidden">
              <h2 className="text-2xl font-bold mb-4">5. Disclaimers and Liability (Focus on Free Service)</h2>
              <h3 className="text-xl font-semibold">No Guarantees</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>The Site is provided <strong className="text-gray-900">"as is"</strong> and <strong className="text-gray-900">"as available."</strong></li>
                <li>We offer no warranties or guarantees of any kind. This includes quality, accuracy, safety, or fitness for a particular purpose.</li>
                <li>We do not guarantee the Site will be error-free or always available.</li>
              </ul>
              <h3 className="text-xl font-semibold">Limit of Liability (Crucial Change for Free Service)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>We are not liable for any direct or indirect damages from your use of the Site.</li>
                <li>This includes lost profits, data loss, or emotional distress.</li>
                <li><strong className="text-gray-900">Because the Site is free to use, we strictly limit our liability.</strong> If we are found liable for any reason, our <strong className="text-gray-900">maximum total liability</strong> to you is strictly limited to the amount you paid for the ad(s) in question.</li>
              </ul>
            </div>

            <div id="section-6" className="content-section space-y-4 hidden">
              <h2 className="text-2xl font-bold mb-4">6. General Legal Terms</h2>
              <h3 className="text-xl font-semibold">Governing Law</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong className="text-gray-900">Compliance with Local Law:</strong> You agree that your use of the Site and all ads you post must follow the laws of your local jurisdiction (where you are located).</li>
                <li><strong className="text-gray-900">Dispute Resolution:</strong> If a serious disagreement arises, we both agree to try to resolve it through friendly negotiation first.</li>
              </ul>
              <h3 className="text-xl font-semibold">Indemnity</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>You agree to protect and defend us (including all legal costs and fees) from any legal claim arising from your use of the Site or your breach of these Terms.</li>
              </ul>
              <h3 className="text-xl font-semibold">Other Terms</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li><strong className="text-gray-900">Severability:</strong> If any part of these Terms is invalid, the rest of the Terms still apply.</li>
                <li><strong className="text-gray-900">Entire Agreement:</strong> These Terms are the entire agreement between you and us regarding the Site.</li>
              </ul>
            </div>

            {/* end content */}

          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsContactPage;
