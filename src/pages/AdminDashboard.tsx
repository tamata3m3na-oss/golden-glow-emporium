import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit2, ArrowUp, ArrowDown, LogOut,
  Package, ShoppingBag, Users, BarChart2, X, Save,
  Upload, Image as ImageIcon, Eye, RefreshCw, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  reorderProduct, defaultProducts, type Product,
} from '@/data/products';
import {
  fetchAdminStats, fetchAdminOrders, updateOrderStatus,
  createProduct, editProduct, removeProduct, reorderProductApi,
} from '@/lib/api';

type Tab = 'products' | 'orders' | 'stats';

interface Order {
  id: number;
  user: { name: string; email: string; phone?: string };
  product: { name: string; imageUrl?: string };
  amount: number;
  paymentMethod: string;
  installments: number;
  perInstallment: number;
  commission: number;
  netTransfer: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Stats {
  totalOrders: number;
  todayOrders: number;
  monthOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'معلق', approved: 'موافق عليه', rejected: 'مرفوض',
  completed: 'مكتمل', cancelled: 'ملغي',
};
const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  approved: 'text-green-400 bg-green-400/10',
  rejected: 'text-red-400 bg-red-400/10',
  completed: 'text-blue-400 bg-blue-400/10',
  cancelled: 'text-gray-400 bg-gray-400/10',
};
const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'معلق', paid: 'مدفوع', failed: 'فاشل',
};

const AdminDashboard = () => {
  const { admin, logout, isAuthenticated, token } = useAdminAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>(getProducts());

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formKarat, setFormKarat] = useState('24');
  const [formDescription, setFormDescription] = useState('');
  const [formOrder, setFormOrder] = useState('');
  const [formImage, setFormImage] = useState<File | null>(null);
  const [formImages, setFormImages] = useState<File[]>([]);
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [formImageUrl, setFormImageUrl] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const hasBackend = Boolean(import.meta.env.VITE_API_URL);

  const loadOrders = useCallback(async () => {
    if (!hasBackend) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    try {
      const data = await fetchAdminOrders(orderStatusFilter || undefined);
      setOrders(data.orders || []);
    } catch {
      toast.error('تعذر تحميل الطلبات');
    } finally {
      setOrdersLoading(false);
    }
  }, [hasBackend, orderStatusFilter]);

  const loadStats = useCallback(async () => {
    if (!hasBackend) {
      setStats(null);
      return;
    }
    setStatsLoading(true);
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch {
      toast.error('تعذر تحميل الإحصائيات');
    } finally {
      setStatsLoading(false);
    }
  }, [hasBackend]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (tab === 'orders') loadOrders();
    if (tab === 'stats') loadStats();
  }, [tab, loadOrders, loadStats]);

  const resetForm = () => {
    setFormName(''); setFormPrice(''); setFormWeight('');
    setFormKarat('24'); setFormDescription(''); setFormOrder('');
    setFormImage(null); setFormImages([]); setFormImagePreview(null);
    setFormImageUrl('');
  };

  const populateForm = (p: Product) => {
    setFormName(p.name);
    setFormPrice(String(p.price));
    setFormWeight(String(p.weight));
    setFormKarat(String(p.karat));
    setFormDescription(p.description || '');
    setFormOrder(String(p.order ?? 0));
    setFormImagePreview(p.imageUrl || null);
    setFormImageUrl(p.imageUrl || '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormImage(file);
    setFormImageUrl('');
    const reader = new FileReader();
    reader.onload = ev => setFormImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setFormImageUrl(url);
    setFormImage(null);
    setFormImagePreview(url || null);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormImage(null);
    setFormImagePreview(null);
    setFormImageUrl('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormImages(files);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('name', formName.trim());
    fd.append('price', formPrice);
    fd.append('weight', formWeight);
    fd.append('karat', formKarat);
    fd.append('description', formDescription.trim());
    fd.append('order', formOrder || '0');
    if (formImage) {
      fd.append('image', formImage);
    } else if (formImageUrl.trim()) {
      fd.append('imageUrl', formImageUrl.trim());
    }
    formImages.forEach(f => fd.append('images', f));
    return fd;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formWeight) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      if (hasBackend) {
        await createProduct(buildFormData());
        toast.success('تم إضافة المنتج بنجاح');
      } else {
        const imageUrl = formImageUrl.trim() || formImagePreview || null;
        addProduct({
          name: formName.trim(),
          price: parseFloat(formPrice),
          weight: formWeight,
          karat: formKarat,
          description: formDescription || `${formName} ذهب عيار ${formKarat}`,
          imageUrl,
          images: null,
          order: formOrder ? parseInt(formOrder) : undefined,
        });
        toast.success('تم إضافة المنتج بنجاح');
      }
      setProducts(getProducts());
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطأ في الإضافة');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !formName || !formPrice || !formWeight) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      if (hasBackend) {
        await editProduct(editingProduct.id, buildFormData());
      } else {
        if (!editingProduct.isDefault) {
          const newImageUrl = formImage
            ? formImagePreview
            : formImageUrl.trim() || editingProduct.imageUrl;
          updateProduct(editingProduct.id, {
            name: formName.trim(),
            price: parseFloat(formPrice),
            weight: formWeight,
            karat: formKarat,
            description: formDescription,
            imageUrl: newImageUrl || null,
            order: formOrder ? parseInt(formOrder) : editingProduct.order,
          });
        }
      }
      toast.success('تم تحديث المنتج بنجاح');
      setProducts(getProducts());
      setEditingProduct(null);
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطأ في التحديث');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      if (hasBackend) {
        await removeProduct(id);
      } else {
        if (defaultProducts.some(p => p.id === id)) {
          toast.error('لا يمكن حذف المنتجات الأساسية');
          return;
        }
        deleteProduct(id);
      }
      toast.success('تم حذف المنتج');
      setProducts(getProducts());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطأ في الحذف');
    }
  };

  const handleReorder = async (id: number, direction: 'up' | 'down') => {
    const allProducts = getProducts();
    const idx = allProducts.findIndex(p => p.id === id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= allProducts.length) return;

    const targetProduct = allProducts[targetIdx];

    if (hasBackend) {
      try {
        const currentOrder = allProducts[idx].order ?? idx;
        const targetOrder = targetProduct.order ?? targetIdx;
        await reorderProductApi(id, targetOrder);
        await reorderProductApi(targetProduct.id, currentOrder);
      } catch {
        toast.error('خطأ في ترتيب المنتج');
        return;
      }
    } else {
      reorderProduct(id, direction);
    }
    setProducts(getProducts());
  };

  const handleStatusChange = async (orderId: number, status: string) => {
    if (!hasBackend) return;
    try {
      await updateOrderStatus(orderId, status);
      toast.success('تم تحديث حالة الطلب');
      loadOrders();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطأ في تحديث الحالة');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(p);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-card border-b gold-border glass-dark">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-extrabold gold-text">لوحة التحكم</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              مرحباً، {admin?.username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b gold-border pb-2 overflow-x-auto">
          {[
            { key: 'products', label: 'المنتجات', icon: Package },
            { key: 'orders', label: 'الطلبات', icon: ShoppingBag },
            { key: 'stats', label: 'الإحصائيات', icon: BarChart2 },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as Tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm ${
                tab === key
                  ? 'gold-gradient text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ─── PRODUCTS TAB ─── */}
          {tab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">إدارة المنتجات ({products.length})</h2>
                <Button
                  onClick={() => { setShowAddForm(true); setEditingProduct(null); resetForm(); }}
                  className="gold-gradient text-primary-foreground font-bold gap-1"
                >
                  <Plus className="h-4 w-4" />
                  إضافة منتج
                </Button>
              </div>

              {/* Add/Edit Form Modal */}
              <AnimatePresence>
                {(showAddForm || editingProduct) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                    onClick={e => { if (e.target === e.currentTarget) { setShowAddForm(false); setEditingProduct(null); resetForm(); } }}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-card rounded-2xl border gold-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-foreground">
                          {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                        </h3>
                        <button
                          onClick={() => { setShowAddForm(false); setEditingProduct(null); resetForm(); }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <form onSubmit={editingProduct ? handleEdit : handleAdd} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 space-y-2">
                            <Label className="text-foreground">اسم المنتج *</Label>
                            <Input
                              value={formName}
                              onChange={e => setFormName(e.target.value)}
                              placeholder="مثال: سبيكة 10 جرام"
                              className="bg-secondary border-border text-foreground"
                              maxLength={200}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground">السعر (ريال) *</Label>
                            <Input
                              type="number"
                              value={formPrice}
                              onChange={e => setFormPrice(e.target.value)}
                              placeholder="15000"
                              className="bg-secondary border-border text-foreground"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground">الوزن (جرام) *</Label>
                            <Input
                              value={formWeight}
                              onChange={e => setFormWeight(e.target.value)}
                              placeholder="10"
                              className="bg-secondary border-border text-foreground"
                              maxLength={20}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground">العيار</Label>
                            <Input
                              value={formKarat}
                              onChange={e => setFormKarat(e.target.value)}
                              placeholder="24"
                              className="bg-secondary border-border text-foreground"
                              maxLength={10}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground">ترتيب الظهور</Label>
                            <Input
                              type="number"
                              value={formOrder}
                              onChange={e => setFormOrder(e.target.value)}
                              placeholder="0"
                              className="bg-secondary border-border text-foreground"
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label className="text-foreground">الوصف</Label>
                            <Input
                              value={formDescription}
                              onChange={e => setFormDescription(e.target.value)}
                              placeholder="وصف المنتج (اختياري)"
                              className="bg-secondary border-border text-foreground"
                              maxLength={500}
                            />
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label className="text-foreground">الصورة الرئيسية</Label>
                          <div
                            className="border-2 border-dashed gold-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => imageInputRef.current?.click()}
                          >
                            {formImagePreview ? (
                              <div className="relative">
                                <img
                                  src={formImagePreview}
                                  alt="معاينة"
                                  className="w-full h-32 object-contain rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={clearImage}
                                  className="absolute top-1 left-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="py-4">
                                <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">اضغط لرفع صورة</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG, WebP (حتى 5MB)</p>
                              </div>
                            )}
                          </div>
                          <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </div>

                        {/* Image URL Input */}
                        <div className="space-y-2">
                          <Label className="text-foreground">أو رابط الصورة</Label>
                          <Input
                            value={formImageUrl}
                            onChange={handleImageUrlChange}
                            placeholder="https://example.com/image.jpg"
                            className="bg-secondary border-border text-foreground"
                            dir="ltr"
                          />
                          <p className="text-xs text-muted-foreground">
                            أدخل رابط URL للصورة بدلاً من رفع ملف
                          </p>
                        </div>

                        {/* Additional Images */}
                        <div className="space-y-2">
                          <Label className="text-foreground">صور إضافية (حتى 5)</Label>
                          <div
                            className="border-2 border-dashed border-border rounded-xl p-3 text-center cursor-pointer hover:border-primary/30 transition-colors"
                            onClick={() => imagesInputRef.current?.click()}
                          >
                            {formImages.length > 0 ? (
                              <p className="text-sm text-muted-foreground">{formImages.length} صورة مختارة</p>
                            ) : (
                              <div className="flex items-center justify-center gap-2 py-2">
                                <Upload className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">رفع صور إضافية</span>
                              </div>
                            )}
                          </div>
                          <input
                            ref={imagesInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImagesChange}
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button type="submit" className="flex-1 gold-gradient text-primary-foreground font-bold gap-1">
                            <Save className="h-4 w-4" />
                            {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => { setShowAddForm(false); setEditingProduct(null); resetForm(); }}
                            className="text-muted-foreground"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products Table */}
              <div className="bg-card rounded-2xl border gold-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b gold-border bg-secondary/50">
                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">الترتيب</th>
                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">الصورة</th>
                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">المنتج</th>
                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">السعر</th>
                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">الوزن</th>
                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">العيار</th>
                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, idx) => (
                        <tr key={product.id} className="border-b gold-border/30 hover:bg-secondary/30 transition-colors">
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleReorder(product.id, 'up')}
                                disabled={idx === 0}
                                className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleReorder(product.id, 'down')}
                                disabled={idx === products.length - 1}
                                className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.description}</p>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                          </td>
                          <td className="p-4 text-muted-foreground text-sm">{product.weight} جرام</td>
                          <td className="p-4 text-muted-foreground text-sm">{product.karat}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowAddForm(false);
                                  populateForm(product);
                                }}
                                className="text-primary hover:bg-primary/10 h-8 w-8"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              {!product.isDefault && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
                                  className="text-destructive hover:bg-destructive/10 h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── ORDERS TAB ─── */}
          {tab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h2 className="text-xl font-bold text-foreground">الطلبات</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={orderStatusFilter}
                      onChange={e => setOrderStatusFilter(e.target.value)}
                      className="bg-secondary border border-border text-foreground rounded-lg px-3 py-2 text-sm pr-8 appearance-none cursor-pointer"
                    >
                      <option value="">جميع الطلبات</option>
                      <option value="pending">معلقة</option>
                      <option value="approved">موافق عليها</option>
                      <option value="rejected">مرفوضة</option>
                      <option value="completed">مكتملة</option>
                      <option value="cancelled">ملغاة</option>
                    </select>
                    <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={loadOrders}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!hasBackend ? (
                <div className="bg-card rounded-2xl border gold-border p-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">الطلبات تتطلب ربط Backend</p>
                  <p className="text-sm text-muted-foreground/60 mt-2">أضف VITE_API_URL في متغيرات البيئة</p>
                </div>
              ) : ordersLoading ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-card rounded-2xl border gold-border p-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">لا توجد طلبات</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-card rounded-xl border gold-border p-5">
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                        <div>
                          <p className="font-semibold text-foreground">{order.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                          {order.user?.phone && <p className="text-xs text-muted-foreground">{order.user.phone}</p>}
                        </div>
                        <div className="text-left">
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${STATUS_COLORS[order.status] || 'text-muted-foreground bg-muted'}`}>
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground text-xs">المنتج</p>
                          <p className="font-medium text-foreground">{order.product?.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">المبلغ</p>
                          <p className="font-bold text-primary">{formatPrice(order.amount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">طريقة الدفع</p>
                          <p className="font-medium text-foreground">{order.paymentMethod === 'tamara' ? 'تمارا' : 'تابي'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">الأقساط</p>
                          <p className="font-medium text-foreground">{order.installments === 1 ? 'كاملة' : `${order.installments} أقساط`}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">كل دفعة</p>
                          <p className="font-medium text-foreground">{formatPrice(order.perInstallment)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">العمولة</p>
                          <p className="font-medium text-foreground">{formatPrice(order.commission)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">صافي التحويل</p>
                          <p className="font-bold text-green-400">{formatPrice(order.netTransfer)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">التاريخ</p>
                          <p className="font-medium text-foreground text-xs">
                            {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>

                      {order.status === 'pending' && (
                        <div className="flex gap-2 pt-3 border-t gold-border/30">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(order.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white gap-1"
                          >
                            ✅ موافقة
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(order.id, 'rejected')}
                            className="text-destructive hover:bg-destructive/10 gap-1"
                          >
                            ❌ رفض
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── STATS TAB ─── */}
          {tab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">الإحصائيات</h2>
                <Button variant="ghost" size="icon" onClick={loadStats} className="text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              {!hasBackend ? (
                <div className="bg-card rounded-2xl border gold-border p-12 text-center">
                  <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">الإحصائيات تتطلب ربط Backend</p>
                  <p className="text-sm text-muted-foreground/60 mt-2">أضف VITE_API_URL في متغيرات البيئة</p>
                </div>
              ) : statsLoading ? (
                <div className="text-center py-20">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : stats ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'إجمالي الطلبات', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-400' },
                    { label: 'طلبات اليوم', value: stats.todayOrders, icon: ShoppingBag, color: 'text-green-400' },
                    { label: 'طلبات الشهر', value: stats.monthOrders, icon: ShoppingBag, color: 'text-yellow-400' },
                    { label: 'طلبات معلقة', value: stats.pendingOrders, icon: ShoppingBag, color: 'text-orange-400' },
                    { label: 'إجمالي المنتجات', value: stats.totalProducts, icon: Package, color: 'text-primary' },
                    { label: 'إجمالي العملاء', value: stats.totalUsers, icon: Users, color: 'text-purple-400' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-card rounded-xl border gold-border p-5">
                      <Icon className={`h-6 w-6 ${color} mb-3`} />
                      <p className="text-2xl font-extrabold text-foreground">{value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{label}</p>
                    </div>
                  ))}
                  <div className="col-span-2 sm:col-span-3 lg:col-span-4 bg-card rounded-xl border gold-border p-5">
                    <BarChart2 className="h-6 w-6 text-primary mb-3" />
                    <p className="text-3xl font-extrabold gold-text">{formatPrice(stats.totalRevenue)}</p>
                    <p className="text-sm text-muted-foreground mt-1">إجمالي الإيرادات (صافي التحويل)</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">تعذر تحميل الإحصائيات</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
