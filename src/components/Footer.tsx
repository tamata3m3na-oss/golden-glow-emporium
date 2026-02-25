import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const paymentMethods = ['Visa', 'Mastercard', 'مدى', 'Apple Pay', 'STC Pay', 'تحويل بنكي'];

const footerLinks = [
  { label: 'من نحن', path: '/about' },
  { label: 'مقاس الخاتم', path: '/ring-size' },
  { label: 'شروط التوصيل', path: '/delivery' },
  { label: 'الأحكام الشرعية', path: '/shariah' },
  { label: 'سياسة الخصوصية', path: '/privacy' },
  { label: 'الشروط والأحكام', path: '/terms' },
  { label: 'الاسترجاع والاستبدال', path: '/returns' },
];

const Footer = () => {
  return (
    <footer className="bg-card border-t gold-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold gold-text mb-4">معلومات المؤسسة</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              مؤسسة حسين إبراهيم حسين للمجوهرات الذهبية. متخصصون في بيع الذهب والمجوهرات والسبائك. نسعى لإرضاء عملائنا وتقديم أفضل الأسعار.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>المملكة العربية السعودية</span>
              </div>
              <a 
                href="https://mc.gov.sa/ar/eservices/Pages/Commercial-data.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 hover:text-primary transition-colors"
              >
                <img 
                  src="https://altmiz.shop/uploads/acac.png" 
                  alt="السجل التجاري" 
                  className="h-6 w-auto"
                />
                <span className="text-xs text-primary/70">بيانات السجل التجاري :1010088875</span>
              </a>
              <Link 
                to="/business-info"
                className="flex items-center gap-2 mt-1 hover:text-primary transition-colors"
              >
                <img 
                  src="https://alfahd.shop/uploads/img%20(6).jpg" 
                  alt="منصة الأعمال السعودية" 
                  className="h-6 w-auto"
                />
                <span className="text-xs text-muted-foreground">مسجل وموثق ضمن منصة الأعمال السعودية</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold gold-text mb-4">روابط سريعة</h3>
            <div className="flex flex-col gap-2">
              {footerLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact + Payment */}
          <div>
            <h3 className="text-lg font-bold gold-text mb-4">تواصل معنا</h3>
            <a
              href="https://wa.me/966594241060"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-primary/20 hover:text-primary transition-colors text-sm mb-6"
            >
              <MessageCircle className="h-4 w-4" />
              تواصل معنا على الواتساب
            </a>

            <h4 className="text-sm font-semibold text-foreground mb-3 mt-4">طرق الدفع</h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map(method => (
                <span
                  key={method}
                  className="px-3 py-1.5 text-xs rounded-md bg-secondary text-muted-foreground border gold-border"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t gold-border mt-10 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} مؤسسة حسين إبراهيم حسين للمجوهرات الذهبية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
