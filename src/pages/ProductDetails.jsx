import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
// استيراد المنتجات من ShopProducts أو نسخها مؤقتاً
const products = [
  {
    id: "1",
    name: "شاشة LCD",
    price: 650,
    oldPrice: 800,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/h9xc0rsa_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/h9xc0rsa_expires_30_days.png",
      "https://images.samsung.com/is/image/samsung/p6pim/eg/ua43au7000uxeg/gallery/eg-uhd-au7000-ua43au7000uxeg-530347991?$650_519_PNG$",
      "https://cdn.lg.com/eg/images/tvs/md07501399/gallery/medium01.jpg"
    ],
    rating: 4.5,
    reviews: 128,
    description: "شاشة LCD عالية الدقة مع تقنية IPS. شاشة مثالية لمشاهدة الأفلام والألعاب والعمل المكتبي مع ألوان واقعية وزوايا رؤية واسعة.",
    details: "تتميز هذه الشاشة بتقنية متقدمة لعرض الصور بدقة عالية وتدرج لوني واسع، مع تصميم نحيف يناسب جميع المساحات.",
    availability: "in-stock",
    brand: "ASUS",
    category: "electronics",
    colors: ["#DB4444", "#007bff"],
    sizes: ["32 بوصة", "40 بوصة", "50 بوصة", "65 بوصة"],
    features: [
      "دقة عالية للصورة",
      "تقنية IPS لزوايا رؤية واسعة",
      "تصميم أنيق وحديث"
    ],
    specs: [
      { label: "الدقة", value: "4K UHD" },
      { label: "المنافذ", value: "HDMI, USB, AV" },
      { label: "الضمان", value: "سنتان" }
    ],
    returnPolicy: "يمكنك إرجاع المنتج خلال 14 يومًا من تاريخ الاستلام في حال وجود عيب صناعي أو عدم مطابقة المواصفات."
  },
  {
    id: "2",
    name: "حقيبة Gucci",
    price: 960,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/0tl68r54_expires_30_days.png",
      "https://cdn-images.farfetch-contents.com/18/20/41/60/18204160_39396413_1000.jpg",
      "https://www.gucci.com/images/cms/2022/gucci-bags-hero.jpg"
    ],
    rating: 4.8,
    reviews: 256,
    description: "حقيبة يد فاخرة من الجلد الطبيعي بتصميم عصري وسعة كبيرة، مثالية للاستخدام اليومي والمناسبات.",
    details: "مصنوعة من أجود أنواع الجلد الطبيعي مع لمسات نهائية دقيقة، وتحتوي على جيوب داخلية متعددة لتسهيل تنظيم الأغراض.",
    availability: "in-stock",
    brand: "Gucci",
    category: "bags",
    colors: ["#DB4444", "#000"],
    sizes: ["صغير", "متوسط", "كبير"],
    features: [
      "جلد طبيعي 100%",
      "تصميم عصري",
      "سعة كبيرة"
    ],
    specs: [
      { label: "الخامة", value: "جلد طبيعي" },
      { label: "الأبعاد", value: "30x20x10 سم" },
      { label: "الضمان", value: "سنة" }
    ],
    returnPolicy: "يمكنك إرجاع المنتج خلال 7 أيام من تاريخ الاستلام بشرط عدم الاستخدام."
  },
  {
    id: "3",
    name: "ذراع ألعاب GP11 Shooter",
    price: 550,
    oldPrice: 700,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/aoc77xzc_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/aoc77xzc_expires_30_days.png",
      "https://m.media-amazon.com/images/I/61Qe0euJJZL._AC_SL1500_.jpg",
      "https://cdn.thewirecutter.com/wp-content/media/2022/11/gamecontrollers-2048px-03233.jpg"
    ],
    rating: 4.2,
    reviews: 89,
    description: "ذراع تحكم احترافي للألعاب مع اهتزاز مزدوج وسلك بطول 2 متر، متوافق مع الكمبيوتر والبلايستيشن.",
    details: "يمنحك تجربة ألعاب واقعية بفضل الاهتزاز المزدوج والتصميم المريح، مع توافق كامل مع معظم الأجهزة.",
    availability: "pre-order",
    brand: "HAVIT",
    category: "games",
    colors: ["#DB4444", "#007bff"],
    sizes: ["قياسي"],
    features: [
      "اهتزاز مزدوج للمزيد من الواقعية",
      "سلك بطول 2 متر",
      "متوافق مع الكمبيوتر والبلايستيشن",
      "تصميم مريح وخفيف الوزن"
    ],
    specs: [
      { label: "النوع", value: "سلكي" },
      { label: "الطول", value: "2 متر" },
      { label: "الضمان", value: "سنة" }
    ],
    returnPolicy: "يمكنك إرجاع المنتج خلال 14 يومًا من تاريخ الاستلام في حال وجود عيب صناعي."
  },
  {
    id: "4",
    name: "جاكيت ساتان مبطن",
    price: 750,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/w21oxegn_expires_30_days.png",
      "https://cdn-images.farfetch-contents.com/17/98/13/60/17981360_39396413_1000.jpg",
      "https://www.nike.com/eg/launch/t/air-jordan-jacket"
    ],
    rating: 4.6,
    reviews: 167,
    description: "جاكيت شتوي أنيق مع بطانة دافئة ومقاوم للماء، مثالي للأيام الباردة.",
    details: "مصنوع من خامات عالية الجودة مع بطانة داخلية تمنحك الدفء والراحة طوال اليوم.",
    availability: "out-of-stock",
    brand: "Nike",
    category: "clothes",
    colors: ["#25D366", "#000"],
    sizes: ["S", "M", "L", "XL"],
    features: [
      "بطانة دافئة",
      "مقاوم للماء",
      "تصميم عصري"
    ],
    specs: [
      { label: "الخامة", value: "ساتان مبطن" },
      { label: "المقاسات", value: "S-XL" },
      { label: "الضمان", value: "6 شهور" }
    ],
    returnPolicy: "يمكنك إرجاع المنتج خلال 7 أيام من تاريخ الاستلام بشرط عدم الاستخدام."
  },
  // منتجات إضافية لزيادة عدد المنتجات في السطر الأفقي
  {
    id: "5",
    name: "ساعة يد ذكية",
    price: 1200,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/clock1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/clock1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/71pWzhdGHPL._AC_SL1500_.jpg",
      "https://cdn.thewirecutter.com/wp-content/media/2022/11/smartwatches-2048px-03233.jpg"
    ],
    rating: 4.7,
    reviews: 210,
    description: "ساعة ذكية مقاومة للماء مع تتبع اللياقة، شاشة ملونة وإشعارات ذكية.",
    details: "تدعم تتبع الخطوات، مراقبة معدل ضربات القلب، إشعارات الهاتف، وبطارية تدوم حتى 7 أيام.",
    availability: "in-stock",
    brand: "Xiaomi",
    category: "watches",
    colors: ["#000", "#20c997"],
    sizes: ["قياسي"],
    features: ["مقاومة للماء", "تتبع اللياقة", "بطارية تدوم طويلاً"],
    specs: [
      { label: "البطارية", value: "7 أيام" },
      { label: "الاتصال", value: "Bluetooth" }
    ],
    returnPolicy: "إرجاع خلال 14 يومًا."
  },
  {
    id: "6",
    name: "كتاب تطوير الذات",
    price: 80,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/book1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/book1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg",
      "https://www.jarir.com/media/catalog/product/1/2/1234567890.jpg"
    ],
    rating: 4.9,
    reviews: 98,
    description: "كتاب ملهم لتطوير الذات وتحقيق النجاح، مناسب لجميع الأعمار.",
    details: "يحتوي على نصائح عملية وتمارين لتطوير الذات وتحقيق الأهداف الشخصية والمهنية.",
    availability: "in-stock",
    brand: "دار المعرفة",
    category: "books",
    colors: ["#fff", "#DB4444"],
    sizes: ["ورقي"],
    features: ["لغة عربية", "طبعة فاخرة"],
    specs: [
      { label: "عدد الصفحات", value: "220" },
      { label: "اللغة", value: "العربية" }
    ],
    returnPolicy: "إرجاع خلال 3 أيام."
  },
  {
    id: "7",
    name: "سماعات بلوتوث",
    price: 350,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/headphones1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/headphones1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg",
      "https://cdn.thewirecutter.com/wp-content/media/2022/11/headphones-2048px-03233.jpg"
    ],
    rating: 4.3,
    reviews: 150,
    description: "سماعات لاسلكية بصوت نقي وميكروفون مدمج، تدعم عزل الضوضاء.",
    details: "بطارية تدوم حتى 10 ساعات، تصميم مريح وخفيف الوزن، متوافقة مع جميع الأجهزة الذكية.",
    availability: "in-stock",
    brand: "Sony",
    category: "electronics",
    colors: ["#000", "#fff"],
    sizes: ["قياسي"],
    features: ["صوت عالي الجودة", "ميكروفون مدمج"],
    specs: [
      { label: "مدة التشغيل", value: "10 ساعات" },
      { label: "الاتصال", value: "Bluetooth" }
    ],
    returnPolicy: "إرجاع خلال 7 أيام."
  },
  {
    id: "8",
    name: "حذاء رياضي رجالي",
    price: 600,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/shoes1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/shoes1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/71k6yQ+QkGL._AC_UL1500_.jpg",
      "https://cdn-images.farfetch-contents.com/16/99/99/99/16999999_39396413_1000.jpg"
    ],
    rating: 4.4,
    reviews: 77,
    description: "حذاء رياضي مريح للتمارين والجري، تصميم عصري وخفيف الوزن.",
    details: "يوفر دعمًا ممتازًا للقدم وتهوية مثالية أثناء الحركة، مناسب للرياضة والاستخدام اليومي.",
    availability: "in-stock",
    brand: "Adidas",
    category: "shoes",
    colors: ["#000", "#fff", "#25D366"],
    sizes: ["41", "42", "43", "44"],
    features: ["راحة فائقة", "تصميم عصري"],
    specs: [
      { label: "المقاسات", value: "41-44" },
      { label: "الخامة", value: "جلد صناعي" }
    ],
    returnPolicy: "إرجاع خلال 14 يومًا."
  },
  {
    id: "9",
    name: "مكواة بخار منزلية",
    price: 300,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/iron1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/iron1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/61w0pVITQwL._AC_SL1500_.jpg",
      "https://cdn.thewirecutter.com/wp-content/media/2022/11/irons-2048px-03233.jpg"
    ],
    rating: 4.1,
    reviews: 34,
    description: "مكواة بخار قوية وسهلة الاستخدام مع خزان ماء كبير.",
    details: "تسخين سريع وبخار قوي لإزالة التجاعيد بسرعة، تصميم مريح وخفيف الوزن.",
    availability: "in-stock",
    brand: "Philips",
    category: "home",
    colors: ["#007bff", "#DB4444"],
    sizes: ["قياسي"],
    features: ["بخار قوي", "خزان ماء كبير"],
    specs: [
      { label: "القوة", value: "2200 واط" },
      { label: "الخزان", value: "350 مل" }
    ],
    returnPolicy: "إرجاع خلال 7 أيام."
  },
  {
    id: "10",
    name: "نظارة شمسية عصرية",
    price: 250,
    image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/glasses1_expires_30_days.png",
    images: [
      "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/SWeYrJ75rl/glasses1_expires_30_days.png",
      "https://m.media-amazon.com/images/I/61p1QwQkGGL._AC_UL1500_.jpg",
      "https://cdn-images.farfetch-contents.com/17/98/13/60/17981360_39396413_1000.jpg"
    ],
    rating: 4.6,
    reviews: 60,
    description: "نظارة شمسية حماية UV وتصميم أنيق، عدسات عالية الجودة.",
    details: "توفر حماية كاملة من الأشعة فوق البنفسجية مع تصميم عصري يناسب جميع الأذواق.",
    availability: "in-stock",
    brand: "Ray-Ban",
    category: "accessories",
    colors: ["#000", "#e83e8c"],
    sizes: ["قياسي"],
    features: ["حماية من الأشعة فوق البنفسجية", "تصميم عصري"],
    specs: [
      { label: "العدسات", value: "UV400" },
      { label: "الخامة", value: "بلاستيك عالي الجودة" }
    ],
    returnPolicy: "إرجاع خلال 5 أيام."
  }
];

const sampleReviews = [
  {
    name: "محمد أحمد",
    rating: 5,
    comment: "منتج ممتاز جدًا وجودة رائعة. أنصح به!",
    date: "2024-06-01"
  },
  {
    name: "سارة علي",
    rating: 4,
    comment: "جيد جدًا لكن التغليف يحتاج لتحسين.",
    date: "2024-05-28"
  },
  {
    name: "خالد مصطفى",
    rating: 3,
    comment: "مقبول بالنسبة للسعر.",
    date: "2024-05-20"
  }
];

function StarRating({ rating, setRating, interactive }) {
  // interactive: إذا true يمكن للمستخدم التقييم
  const [hovered, setHovered] = useState(null);
  const display = hovered !== null ? hovered : rating;
  return (
    <span style={{ cursor: interactive ? "pointer" : "default", fontSize: "1.5em", userSelect: 'none' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <i
          key={i}
          className={
            display >= i
              ? "fas fa-star text-warning"
              : display >= i - 0.5
              ? "fas fa-star-half-alt text-warning"
              : "far fa-star text-warning"
          }
          onMouseEnter={interactive ? () => setHovered(i) : undefined}
          onMouseLeave={interactive ? () => setHovered(null) : undefined}
          onClick={interactive && setRating ? () => setRating(i) : undefined}
          style={{transition: 'transform 0.15s', transform: hovered === i ? 'scale(1.2)' : 'scale(1)'}}
        />
      ))}
    </span>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviews, setReviews] = useState(sampleReviews);
  const [mainImg, setMainImg] = useState(product?.images ? product.images[0] : product?.image);

  // منتجات مشابهة (من نفس الفئة أو عشوائي)
  const similar = products.filter(p => p.category === product?.category && p.id !== product.id);
  const similarProducts = similar.length > 0 ? similar : products.filter(p => p.id !== product.id);

  // سحب المنتجات المشابهة
  const carouselRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    setScrollStart(carouselRef.current.scrollLeft);
  };
  const handleDragMove = (e) => {
    if (!isDragging) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const walk = dragStartX - x;
    carouselRef.current.scrollLeft = scrollStart + walk;
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  if (!product) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <h2 className="text-danger">المنتج غير موجود</h2>
          <button className="btn btn-dark mt-3" onClick={() => navigate(-1)}>رجوع</button>
        </div>
        <Footer />
      </>
    );
  }

  const handleReviewChange = e => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };
  const handleReviewSubmit = e => {
    e.preventDefault();
    if (reviewForm.name && reviewForm.comment) {
      setReviews([{ ...reviewForm, date: new Date().toISOString().slice(0, 10) }, ...reviews]);
      setReviewForm({ name: "", rating: 5, comment: "" });
    }
  };
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const whatsappMsg = `مرحبًا، أود شراء المنتج: ${product.name} (${selectedSize}) بسعر ${product.price} ج.م\nرابط المنتج: ${currentUrl}`;
  const whatsappUrl = `https://wa.me/201010254819?text=${encodeURIComponent(whatsappMsg)}`;

  return (    
    <>
      <Header />
      <div className="container py-4">
        <div className="row mb-4 align-items-center">
          <div className="col-12 col-md-6 d-flex flex-column align-items-center gap-3">
            <div style={{background: '#f6f6f6', borderRadius: 24, padding: 16, boxShadow: '0 4px 24px #0001', width: '100%', display: 'flex', justifyContent: 'center', minHeight: 320}}>
              <img src={mainImg} alt={product.name} style={{maxWidth: 480, maxHeight: 420, borderRadius: 18, objectFit: 'contain', width: '100%', transition: '0.25s'}} />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="d-flex gap-2 mt-3 justify-content-center flex-wrap">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={product.name + '-img-' + idx}
                    style={{width: 64, height: 64, objectFit: 'cover', borderRadius: 10, border: mainImg === img ? '2.5px solid #DB4444' : '2px solid #eee', cursor: 'pointer', transition: 'border 0.2s'}}
                    onClick={() => setMainImg(img)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <h2 className="fw-bold mb-2" style={{fontSize: '2.1rem'}}>{product.name}</h2>
            <div className="mb-2 text-muted" style={{fontSize: '1.1rem'}}>{product.brand}</div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark" style={{fontSize: '1.1em'}}>
                <StarRating rating={product.rating} /> {product.rating}
              </span>
              <span className="text-muted">({product.reviews} تقييم)</span>
              <span className={`badge ${product.availability === 'in-stock' ? 'bg-success' : product.availability === 'pre-order' ? 'bg-warning text-dark' : 'bg-danger'}`}>{product.availability === 'in-stock' ? 'متوفر' : product.availability === 'pre-order' ? 'طلب مسبق' : 'غير متوفر'}</span>
            </div>
            <div className="mb-3">
              <span className="text-danger fw-bold fs-3">{product.price} ج.م</span>
              {product.oldPrice && <span className="text-muted text-decoration-line-through ms-2">{product.oldPrice} ج.م</span>}
            </div>
            <p className="mb-3 text-muted" style={{fontSize: '1.1rem'}}>{product.description}</p>
            <div className="mb-3">
              <span className="fw-bold">المقاس:</span>
              <div className="d-flex gap-2 mt-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`btn btn-sm ${selectedSize === size ? 'btn-danger text-white' : 'btn-outline-dark'}`}
                    style={{minWidth: 70, fontWeight: 700, fontSize: '1.1em'}}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <span className="fw-bold">المميزات:</span>
              <ul className="mt-2">
                {product.features.map((f, i) => <li key={i} className="text-muted">{f}</li>)}
              </ul>
            </div>
            <div className="mb-3">
              <span className="fw-bold">المواصفات:</span>
              <ul className="mt-2">
                {product.specs.map((s, i) => <li key={i} className="text-muted"><b>{s.label}:</b> {s.value}</li>)}
              </ul>
            </div>
            <div className="mb-3">
              <span className="fw-bold">سياسة الإرجاع:</span>
              <div className="text-muted mt-2">{product.returnPolicy}</div>
            </div>
            <div className="d-flex gap-3 mt-4 flex-wrap">
              <button className="btn btn-danger px-4">أضف للسلة</button>
              <button className="btn btn-outline-danger px-4">أضف للمفضلة</button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-success px-4 d-flex align-items-center gap-2">
                <i className="fab fa-whatsapp"></i> اطلب عبر واتساب
              </a>
              <button className="btn btn-dark px-4" onClick={() => navigate(-1)}>رجوع</button>
            </div>
          </div>
        </div>
        {/* وصف تفصيلي للمنتج */}
        <div className="row justify-content-center mt-4 mb-5">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="bg-light rounded p-4 text-center shadow-sm" style={{fontSize: '1.13em', border: '1px solid #eee'}}>
              <h5 className="fw-bold mb-3 text-danger">وصف المنتج التفصيلي</h5>
              <div className="text-muted">{product.details}</div>
            </div>
          </div>
        </div>
        {/* قسم التقييمات */}
        <div className="row mt-5">
          <div className="col-12 col-lg-8 mx-auto">
            <div className="bg-white rounded shadow-sm p-4 mb-4" style={{border: '1px solid #eee'}}>
              <h4 className="fw-bold mb-4 text-center"><i className="fas fa-star text-warning ms-2"></i> تقييمات العملاء</h4>
              <div className="mb-4">
                {reviews.length === 0 && <div className="alert alert-info text-center">لا توجد تقييمات بعد.</div>}
                {reviews.map((r, i) => (
                  <div key={i} className="border-bottom pb-3 mb-3">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <StarRating rating={r.rating} />
                      <b>{r.name}</b>
                      <span className="text-muted small">{r.date}</span>
                    </div>
                    <div className="text-muted" style={{fontSize: '1.08em'}}>{r.comment}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReviewSubmit} className="border rounded p-3 bg-light">
                <h6 className="fw-bold mb-3 text-center">أضف تقييمك</h6>
                <div className="row g-2 mb-2 align-items-center justify-content-center">
                  <div className="col-md-4 mb-2 mb-md-0">
                    <input type="text" name="name" className="form-control" placeholder="اسمك" value={reviewForm.name} onChange={handleReviewChange} required />
                  </div>
                  <div className="col-md-4 mb-2 mb-md-0 text-center">
                    <StarRating rating={reviewForm.rating} setRating={r => setReviewForm(f => ({...f, rating: r}))} interactive={true} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" name="comment" className="form-control" placeholder="تعليقك" value={reviewForm.comment} onChange={handleReviewChange} required />
                  </div>
                </div>
                <div className="text-center">
                  <button className="btn btn-danger mt-2 px-5" type="submit">إرسال التقييم</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* منتجات مشابهة */}
        <div className="row mt-5">
          <div className="col-12">
            <h4 className="fw-bold mb-4 text-center">منتجات مشابهة</h4>
            <div
              ref={carouselRef}
              className={`similar-carousel position-relative d-flex justify-content-center ${isDragging ? 'dragging' : ''}`}
              style={{overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: 8, cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none'}}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div style={{display: 'flex', gap: 24, minWidth: 320, justifyContent: 'center', width: '100%', transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(.4,1.3,.6,1)'}}>
                {similarProducts.map(item => (
                  <div
                    key={item.id}
                    className={`card shadow-sm border-0 d-inline-block product-similar-card${isDragging ? ' dragging-card' : ''}`}
                    style={{width: 260, minWidth: 240, borderRadius: 16, cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', verticalAlign: 'top', transform: isDragging ? 'scale(0.97)' : 'scale(1)'}}
                    onClick={() => {
                      if (!isDragging) {
                        navigate(`/product/${item.id}`, { replace: true });
                        setTimeout(() => window.location.reload(), 0);
                      }
                    }}
                  >
                    <div style={{background: '#f6f6f6', borderRadius: 16, padding: 12, display: 'flex', justifyContent: 'center'}}>
                      <img src={item.image} alt={item.name} style={{height: 140, objectFit: 'contain', borderRadius: 12}} />
                    </div>
                    <div className="card-body text-center p-2">
                      <h6 className="fw-bold mb-1" style={{fontSize: '1.08em', minHeight: 36}}>{item.name}</h6>
                      <div className="mb-1"><StarRating rating={item.rating} /></div>
                      <div className="text-danger fw-bold mb-1" style={{fontSize: '1.1em'}}>{item.price} ج.م</div>
                      {item.oldPrice && <div className="text-muted text-decoration-line-through small mb-1">{item.oldPrice} ج.م</div>}
                      <div className="text-muted mb-1" style={{fontSize: '0.98em'}}>{item.brand}</div>
                      <div className="text-muted mb-2" style={{fontSize: '0.97em', minHeight: 36, overflow: 'hidden', textOverflow: 'ellipsis'}}>{item.description}</div>
                      <div className="d-flex justify-content-center gap-1 flex-wrap mb-2">
                        {item.colors.map((color, idx) => (
                          <span key={idx} style={{width: 18, height: 18, borderRadius: '50%', background: color, border: '1.5px solid #eee', display: 'inline-block'}}></span>
                        ))}
                      </div>
                      <div className="d-flex justify-content-center gap-1 flex-wrap">
                        {item.sizes.filter(s => s !== 'قياسي' && s !== 'ورقي').map((size, idx) => (
                          <span key={idx} className="badge bg-light text-dark border" style={{fontSize: '0.85em', margin: 1}}>{size}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .similar-carousel::-webkit-scrollbar {
          display: none !important;
        }
        .similar-carousel {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .product-similar-card:hover {
          box-shadow: 0 8px 32px #db444455 !important;
          transform: scale(1.04) translateY(-4px);
        }
        .dragging .product-similar-card {
          transition: none !important;
        }
        @media (max-width: 767px) {
          .container {
            padding-left: 4px !important;
            padding-right: 4px !important;
          }
          .row.mb-4.align-items-center {
            flex-direction: column !important;
            gap: 0 !important;
          }
          .col-12.col-md-6.d-flex.flex-column.align-items-center.gap-3 {
            align-items: stretch !important;
            gap: 0 !important;
          }
          .col-12.col-md-6 {
            padding-left: 0 !important;
            padding-right: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
          }
          .product-details-main-img {
            width: 100% !important;
            max-width: 100vw !important;
            min-height: 220px !important;
            max-height: 260px !important;
            margin-bottom: 10px;
            border-radius: 18px !important;
            box-shadow: 0 4px 24px #0002;
            background: #fff;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
          .product-details-mobile-block {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 12px #0001;
            margin-bottom: 18px;
            padding: 18px 10px 10px 10px;
            text-align: center;
          }
          .product-details-mobile-title {
            font-size: 1.3rem !important;
            font-weight: bold;
            margin-bottom: 6px;
            color: #222;
          }
          .product-details-mobile-brand {
            color: #888;
            font-size: 1.05em;
            margin-bottom: 4px;
          }
          .product-details-mobile-price {
            font-size: 1.18rem !important;
            color: #db4444;
            font-weight: bold;
            margin-bottom: 6px;
          }
          .product-details-mobile-rating {
            margin-bottom: 10px;
          }
          .product-details-mobile-desc {
            color: #555;
            font-size: 1.08em;
            margin-bottom: 10px;
          }
          .product-details-mobile-btns {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin-bottom: 10px;
            margin-top: 8px;
          }
          .product-details-mobile-btns .btn {
            font-size: 1.13em !important;
            padding: 12px 16px !important;
            min-width: 140px;
            border-radius: 12px !important;
            box-shadow: 0 2px 8px #0001;
            border: 1.5px solid #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .product-details-mobile-btns .btn i {
            font-size: 1.3em;
          }
          .product-details-mobile-thumbs {
            display: flex;
            gap: 6px;
            justify-content: center;
            margin: 10px 0 18px 0;
            overflow-x: auto;
            padding-bottom: 2px;
          }
          .product-details-mobile-thumbs img {
            width: 54px;
            height: 54px;
            object-fit: cover;
            border-radius: 10px;
            border: 2px solid #eee;
            cursor: pointer;
            transition: border 0.2s;
            background: #fafafa;
          }
          .product-details-mobile-thumbs img.selected {
            border: 2.5px solid #DB4444;
          }
        }
      `}</style>
    </>
  );
} 