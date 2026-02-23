import { Link } from 'react-router-dom';
import { Facebook, MapPin, Phone, Mail } from 'lucide-react';

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
              <p className="text-xs mt-2 text-primary/70">
                بيانات السجل التجاري: 1010088875
              </p>
              <p className="text-xs text-muted-foreground">
                مسجل وموثق ضمن منصة الأعمال السعودية
              </p>
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
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-primary/20 hover:text-primary transition-colors text-sm mb-6"
            >
              <Facebook className="h-4 w-4" />
              تابعنا على فيسبوك
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
