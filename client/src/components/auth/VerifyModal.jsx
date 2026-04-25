const VerifyEmailModal = () => (
  <div className="relative w-full max-w-sm p-8 text-center rounded-2xl bg-white border-2 border-teal-600/30 shadow-2xl">
    <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-6">
      <Mail className="text-teal-600" size={32} />
    </div>
    
    <h3 className="text-xl font-black uppercase text-gray-800 mb-2">Check your mail</h3>
    <p className="text-sm text-gray-500 mb-8">
      We sent a verification link to <span className="font-bold text-gray-700 ">juan@example.com</span>
    </p>

    <button className="w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
      Resend Email
    </button>
  </div>
);
export default VerifyEmailModal;