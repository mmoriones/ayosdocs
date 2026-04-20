const VerifyEmailModal = () => (
  <div className="relative w-full max-w-sm p-8 text-center rounded-2xl bg-white dark:bg-[#242729] border-2 border-teal-600/30 shadow-2xl">
    <div className="mx-auto w-16 h-16 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center mb-6">
      <Mail className="text-teal-600" size={32} />
    </div>
    
    <h3 className="text-xl font-black uppercase text-gray-800 dark:text-gray-100 mb-2">Check your mail</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
      We sent a verification link to <span className="font-bold text-gray-700 dark:text-gray-200">juan@example.com</span>
    </p>

    <button className="w-full border-2 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      Resend Email
    </button>
  </div>
);
export default VerifyEmailModal;