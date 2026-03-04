import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'من نحن', path: '/about' },
  { label: 'الشروط والأحكام', path: '/terms' },
  { label: 'سياسة الخصوصية', path: '/privacy' },
  { label: 'سياسة الاسترجاع والاستبدال', path: '/returns' },
  { label: 'طريقة معرفة مقاس الخاتم', path: '/ring-size' },
  { label: 'الأحكام الشرعية', path: '/shariah' },
  { label: 'شروط التوصيل', path: '/delivery' },
];

const Footer = () => {
  return (
    <footer 
      className="border-t" 
      style={{ 
        background: '#0B1020',
        borderColor: 'rgba(212, 175, 55, 0.2)'
      }}
    >
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Company Info Card with Gold Gradient */}
        <div 
          className="rounded-2xl p-6 mb-8"
          style={{ 
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #F6E27A 100%)',
          }}
        >
          <h3 className="text-xl font-bold text-[#0B1020] mb-2 text-center">
            مؤسسة Hussein Ibrahim Gold
          </h3>
          <p className="text-sm text-[#0B1020]/80 text-center mb-4">
            متجركم الأول للذهب والألماس في المملكة العربية السعودية
          </p>
          
          {/* Links in Gold Card */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {footerLinks.slice(0, 4).map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs text-[#0B1020] hover:text-[#0B1020]/70 transition-colors px-2 py-1 rounded-lg bg-[#0B1020]/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {footerLinks.slice(4).map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs text-[#0B1020] hover:text-[#0B1020]/70 transition-colors px-2 py-1 rounded-lg bg-[#0B1020]/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Zakat and Income Badge */}
        <div className="flex justify-center mb-6">
          <a
            href="https://zatca.gov.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl theme-card-bg border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors"
            style={{ background: '#0F172A' }}
          >
            <img
              src="https://altmiz.shop/uploads/acac.png"
              alt="ضريبة القيمة المضافة"
              className="h-14 w-auto object-contain"
            />
          </a>
        </div>

        {/* Commercial Registration & Verified */}
        <div className="flex flex-col gap-3 mb-6">
          <a
            href="https://mc.gov.sa/ar/eservices/Pages/Commercial-data.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl theme-card-bg border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors text-right"
            style={{ background: '#0F172A' }}
          >
            <img
              src="https://altmiz.shop/uploads/acac.png"
              alt="السجل التجاري"
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="text-sm font-bold text-[#E6ECF8]">السجل التجاري</p>
              <p className="text-xs text-[#D4AF37]">1010088875</p>
            </div>
          </a>
          
          <Link
            to="/business-info"
            className="flex items-center gap-3 p-3 rounded-xl theme-card-bg border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors text-right"
            style={{ background: '#0F172A' }}
          >
            <img
              src="https://alfahd.shop/uploads/img%20(6).jpg"
              alt="منصة الأعمال السعودية"
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="text-sm font-bold text-[#E6ECF8]">موثق لدى وزارة التجارة</p>
              <p className="text-xs text-[#D4AF37]">مسجل وموثق</p>
            </div>
          </Link>
        </div>

        {/* Copyright */}
        <div 
          className="border-t pt-5" 
          style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
        >
          <p className="text-xs text-[#E6ECF8]/60 text-center">
            © {new Date().getFullYear()} مؤسسة Hussein Ibrahim Gold. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
