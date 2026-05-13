const VerifyEmailModal = () => (
  <div className="relative w-full max-w-sm p-8 text-center rounded-2xl bg-ctp-mantle border-2 border-ctp-green/30 shadow-2xl">
    <div className="mx-auto w-16 h-16 bg-ctp-green/10 rounded-full flex items-center justify-center mb-6">
      <Mail className="text-ctp-green" size={32} />
    </div>
    
    <h3 className="text-xl font-black uppercase text-ctp-text mb-2">Check your mail</h3>
    <p className="text-sm text-ctp-subtext1 mb-8">
      We sent a verification link to <span className="font-bold text-ctp-subtext0 ">juan@example.com</span>
    </p>

    <button className="w-full border-2 border-ctp-surface2 text-ctp-subtext1 font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-ctp-mantle transition-colors">
      Resend Email
    </button>
  </div>
);
export default VerifyEmailModal;