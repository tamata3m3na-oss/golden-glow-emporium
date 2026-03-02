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
    <footer className="border-t gold-border" style={{ background: 'hsl(225 40% 6%)' }}>
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <h3 className="text-base font-bold gold-text mb-1">روابط مهمة</h3>
        <div className="w-10 h-0.5 gold-gradient mx-auto rounded-full mb-5" />
        <div className="flex flex-col gap-2 mb-8">
          {footerLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-muted-foreground hover:text-primary transition-colors py-0.5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex justify-center mb-6">
          <a
            href="https://mc.gov.sa/ar/eservices/Pages/Commercial-data.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-card border gold-border hover:border-primary/50 transition-colors"
          >
            <img
              src="https://altmiz.shop/uploads/acac.png"
              alt="ضريبة القيمة المضافة"
              className="h-14 w-auto object-contain"
            />
          </a>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <a
            href="https://mc.gov.sa/ar/eservices/Pages/Commercial-data.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-card border gold-border hover:border-primary/50 transition-colors text-right"
          >
            <img
              src="https://altmiz.shop/uploads/acac.png"
              alt="السجل التجاري"
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="text-sm font-bold text-foreground">السجل التجاري</p>
              <p className="text-xs text-muted-foreground">1010088875</p>
            </div>
          </a>
          <Link
            to="/business-info"
            className="flex items-center gap-3 p-3 rounded-xl bg-card border gold-border hover:border-primary/50 transition-colors text-right"
          >
            <img
              src="https://alfahd.shop/uploads/img%20(6).jpg"
              alt="منصة الأعمال السعودية"
              className="h-10 w-auto object-contain"
            />
            <div>
              <p className="text-sm font-bold text-foreground">منصة الأعمال السعودية</p>
              <p className="text-xs text-muted-foreground">مسجل وموثق</p>
            </div>
          </Link>
        </div>

        <div className="border-t gold-border pt-5">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} مؤسسة حسين إبراهيم حسين للمجوهرات الذهبية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
