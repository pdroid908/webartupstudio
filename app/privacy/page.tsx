import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300 font-sans p-8 md:p-20">
      
      {/* Tombol Back */}
      <div className="max-w-4xl mx-auto mb-10">
        <a href="/" className="text-blue-500 hover:text-blue-400 transition-all font-bold flex items-center gap-2">
          <span>←</span> Back to Artup Studio
        </a>
      </div>

      {/* Konten Privacy Policy */}
      <article className="max-w-4xl mx-auto bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl leading-relaxed">
        <h1 className="text-3xl font-black text-white mb-8 italic tracking-tighter">PRIVACY POLICY</h1>
        
        <p className="mb-6">
          This privacy policy applies to all applications and services (collectively referred to as <strong>"Applications"</strong>) developed and provided by <strong>Artup Studio</strong> (hereby referred to as "Service Provider") as a Free service. Our services are intended for use on an "AS IS" basis.
        </p>

        <h2 className="text-xl font-bold text-blue-400 mt-10 mb-4 uppercase tracking-wider">Information Collection and Use</h2>
        <p className="mb-4">The Applications collect information when you download and use them. This information may include:</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
          <li>Your device's Internet Protocol address (e.g. IP address)</li>
          <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
          <li>The total time spent on the Application</li>
          <li>The operating system you use on your mobile device</li>
        </ul>

        <p className="mb-6">The Application does not gather precise information about the location of your mobile device. The Application does not use Artificial Intelligence (AI) technologies to process your data or provide features.</p>

        <h2 className="text-xl font-bold text-blue-400 mt-10 mb-4 uppercase tracking-wider">Third Party Access</h2>
        <p className="mb-4">Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. Below are the links to the Privacy Policy of the third-party service providers used by the Application:</p>
        <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
          <li><a href="https://www.google.com/policies/privacy/" className="text-blue-500 underline">Google Play Services</a></li>
          <li><a href="https://support.google.com/admob/answer/6128543?hl=id" className="text-blue-500 underline">AdMob</a></li>
        </ul>

        <h2 className="text-xl font-bold text-blue-400 mt-10 mb-4 uppercase tracking-wider">Contact Us</h2>
        <p className="mb-6">If you have any questions regarding privacy while using the Application, please contact the Service Provider via email at <span className="text-white font-bold">p1998nr@gmail.com</span>.</p>

        <div className="mt-12 pt-6 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
          EFFECTIVE DATE: 2026-03-18 | Artup STUDIO DEV KIT 
        </div>
      </article>
    </main>
  );
}