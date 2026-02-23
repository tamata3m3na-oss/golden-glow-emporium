import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { getProducts, addProduct, deleteProduct, defaultProducts, type Product } from '@/data/products';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [karat, setKarat] = useState('24');
  const [description, setDescription] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !weight) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    addProduct({
      name,
      price: parseFloat(price),
      weight,
      karat,
      description: description || `${name} ذهب عيار ${karat}`,
    });
    setProducts(getProducts());
    setName(''); setPrice(''); setWeight(''); setDescription('');
    toast.success('تم إضافة المنتج بنجاح');
  };

  const handleDelete = (id: number) => {
    if (defaultProducts.some(p => p.id === id)) {
      toast.error('لا يمكن حذف المنتجات الأساسية');
      return;
    }
    deleteProduct(id);
    setProducts(getProducts());
    toast.success('تم حذف المنتج');
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(p);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold gold-text mb-8">لوحة التحكم</h1>

          {/* Add Product Form */}
          <div className="bg-card rounded-2xl border gold-border p-8 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-6">إضافة منتج جديد</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">اسم المنتج *</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="مثال: سبيكة 10 جرام" className="bg-secondary border-border text-foreground" maxLength={200} required />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">السعر (ريال) *</Label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="مثال: 15000" className="bg-secondary border-border text-foreground" required />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">الوزن (جرام) *</Label>
                <Input value={weight} onChange={e => setWeight(e.target.value)} placeholder="مثال: 10" className="bg-secondary border-border text-foreground" maxLength={20} required />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">العيار</Label>
                <Input value={karat} onChange={e => setKarat(e.target.value)} placeholder="24" className="bg-secondary border-border text-foreground" maxLength={10} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-foreground">الوصف</Label>
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف المنتج (اختياري)" className="bg-secondary border-border text-foreground" maxLength={500} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="gold-gradient text-primary-foreground font-bold">
                  <Plus className="h-4 w-4 ml-1" /> إضافة المنتج
                </Button>
              </div>
            </form>
          </div>

          {/* Products List */}
          <div className="bg-card rounded-2xl border gold-border p-8">
            <h2 className="text-lg font-bold text-foreground mb-6">المنتجات ({products.length})</h2>
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between bg-secondary rounded-lg p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.weight} جرام | عيار {product.karat}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold">{formatPrice(product.price)}</span>
                    {!defaultProducts.some(p => p.id === product.id) && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
