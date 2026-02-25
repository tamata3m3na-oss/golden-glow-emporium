import { useEffect } from 'react';
import { CheckCircle, FileText, Building2, CreditCard, Globe, Calendar } from 'lucide-react';

const BusinessVerification = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const verificationData = [
    { label: 'رقم التوثيق', value: '00000878390', icon: FileText },
    { label: 'رقم السجل التجاري', value: '1010088875', icon: Building2 },
    { label: 'الرقم الوطني الموحد', value: '7002149412', icon: Building2 },
    { label: 'تاريخ التوثيق', value: '2026/02/18', icon: Calendar },
    { label: 'الحالة', value: 'فعال', icon: CheckCircle, isStatus: true },
    { label: 'نهاية الصلاحية', value: '2027/12/24', icon: Calendar },
    { label: 'نوع الوثيقة', value: 'السجل التجاري', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      {/* Header with SDAIA Branding */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#1a365d] p-3 rounded-lg">
                <svg viewBox="0 0 100 100" className="w-10 h-10">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2"/>
                  <path d="M50 15 L50 85 M15 50 L85 50" stroke="white" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1a365d]">منصة الأعمال السعودية</h1>
                <p className="text-sm text-slate-500">Saudi Business Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">مدعوم من</span>
              <div className="bg-[#1a365d] px-4 py-2 rounded-lg">
                <span className="text-white font-bold text-lg">SDAIA</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Certificate Header */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Certificate Banner */}
            <div className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-4 rounded-full">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">شهادة توثيق المنشأة</h2>
                    <p className="text-slate-300">Business Verification Certificate</p>
                  </div>
                </div>
                <div className="text-center bg-white/10 px-6 py-3 rounded-xl">
                  <p className="text-xs text-slate-300 mb-1">حالة التوثيق</p>
                  <p className="text-green-400 font-bold text-lg">موثق وفعال</p>
                </div>
              </div>
            </div>

            {/* Certificate Content */}
            <div className="p-8">
              {/* SDAIA Logo Center */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-[#1a365d] rounded-full mb-4">
                  <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3"/>
                    <path d="M50 10 L50 90 M10 50 L90 50" stroke="white" strokeWidth="3"/>
                    <circle cx="50" cy="50" r="25" fill="none" stroke="white" strokeWidth="3"/>
                    <circle cx="50" cy="50" r="10" fill="white"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1a365d] mb-1">الهيئة السعودية للبيانات والذكاء الاصطناعي</h3>
                <p className="text-slate-500">Saudi Data and Artificial Intelligence Authority</p>
              </div>

              {/* Verification Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {verificationData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-[#1a365d]/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${item.isStatus ? 'bg-green-100' : 'bg-[#1a365d]/10'}`}>
                        <item.icon className={`w-5 h-5 ${item.isStatus ? 'text-green-600' : 'text-[#1a365d]'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 mb-1">{item.label}</p>
                        <p className={`font-bold text-lg ${item.isStatus ? 'text-green-600' : 'text-slate-800'}`}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Activities */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#1a365d]/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#1a365d]" />
                  </div>
                  <h4 className="font-bold text-[#1a365d]">الأنشطة التجارية</h4>
                </div>
                <p className="text-slate-700 bg-white p-4 rounded-lg border border-slate-200">
                  تجارة الذهب والأحجار الكريمة وخدمات وتمارا
                </p>
              </div>

              {/* IBAN */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#1a365d]/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-[#1a365d]" />
                  </div>
                  <h4 className="font-bold text-[#1a365d]">رقم الآيبان</h4>
                </div>
                <p className="text-slate-700 bg-white p-4 rounded-lg border border-slate-200 font-mono text-lg text-center tracking-wider">
                  SA8810000027665910000654
                </p>
              </div>

              {/* Store Name */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#1a365d]/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#1a365d]" />
                  </div>
                  <h4 className="font-bold text-[#1a365d]">اسم المتجر</h4>
                </div>
                <p className="text-slate-700 bg-white p-4 rounded-lg border border-slate-200 text-lg font-semibold">
                  مؤسسة حسين إبراهيم حسين
                </p>
              </div>

              {/* Verified Platforms */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#1a365d]/10 rounded-lg">
                    <Globe className="w-5 h-5 text-[#1a365d]" />
                  </div>
                  <h4 className="font-bold text-[#1a365d]">المنصات الموثقة</h4>
                </div>
                <a
                  href="https://hussingold.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a365d] bg-white p-4 rounded-lg border border-slate-200 block hover:bg-[#1a365d]/5 transition-colors text-center font-medium"
                >
                  https://hussingold.netlify.app/
                </a>
              </div>

              {/* Verification Seal */}
              <div className="text-center pt-6 border-t border-slate-200">
                <div className="inline-flex items-center gap-3 bg-green-50 px-6 py-4 rounded-xl border border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="text-right">
                    <p className="font-bold text-green-800">تم التحقق من صحة البيانات</p>
                    <p className="text-sm text-green-600">Verified by Saudi Business Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 mb-2">
              تطوير الهيئة السعودية للبيانات والذكاء الاصطناعي - سدايا
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#1a365d] font-bold text-lg">SDAIA</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">Saudi Data and Artificial Intelligence Authority</span>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              جميع الحقوق محفوظة © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessVerification;
